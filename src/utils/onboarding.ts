import { StorageService } from '@/services/storage.service';
import { MandatoryFlow } from '@/types/storage.types';

export const ROLE_STEPS = {
  ISP: [
    'partnerProfile',
    'kycUpload',
    'partnerServiceSelection',
    'partnerServiceAreaCreation',
    'termsAndConditions',
    'policies'
  ],
  BSP: [
    'partnerProfile',
    'businessProfile',
    'kycUpload',
    'businessDocumentUpload',
    'branchCreation',
    'partnerServiceSelection',
    'serviceBranchMapping',
    'branchEmployeeMapping',
    'addingEmployee',
    'partnerServiceAreaCreation',
    'termsAndConditions',
    'policies'
  ],
  BS: [
    'partnerProfile',
    'businessProfile',
    'kycUpload',
    'businessDocumentUpload',
    'branchCreation',
    'partnerServiceAreaCreation',
    'termsAndConditions',
    'policies'
  ]
} as const;

export const STEP_ROUTES: Record<keyof MandatoryFlow, string> = {
  partnerProfile: '/(auth)/create-profile',
  businessProfile: '/(auth)/business-profile',
  kycUpload: '/(tabs)/kyc/upload',
  businessDocumentUpload: '/(tabs)/business/upload',
  branchCreation: '/(tabs)/branch',
  partnerServiceSelection: '/(tabs)/services',
  serviceBranchMapping: '/(tabs)/mapping',
  branchEmployeeMapping: '/(tabs)/employee',
  addingEmployee: '/(tabs)/add-employee',
  partnerServiceAreaCreation: '/(tabs)/service-area',
  termsAndConditions: '/(tabs)/terms',
  policies: '/(tabs)/policies'
};

export async function getNextStepRoute(currentStepKey: keyof MandatoryFlow, role: 'ISP' | 'BSP' | 'BS'): Promise<string> {
  const steps = ROLE_STEPS[role] as readonly string[];
  const currentIndex = steps.indexOf(currentStepKey);
  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return '/(tabs)';
  }
  const nextKey = steps[currentIndex + 1] as keyof MandatoryFlow;
  return STEP_ROUTES[nextKey];
}

export async function completeStepAndNavigate(
  currentStepKey: keyof MandatoryFlow,
  router: any,
  status: 'completed' | 'reviewing' = 'completed'
) {
  try {
    await StorageService.updateMandatoryFlowStep(currentStepKey, status);
    const session = await StorageService.getUserSession();
    const role = session?.role || 'ISP';
    const nextRoute = await getNextStepRoute(currentStepKey, role as any);
    
    // Check if everything is complete when navigating back to (tabs)
    if (nextRoute === '/(tabs)') {
      const flowState = await StorageService.getMandatoryFlow();
      const steps = ROLE_STEPS[role as keyof typeof ROLE_STEPS] || [];
      const isAllDone = steps.every(step => {
        const s = flowState[step as keyof MandatoryFlow];
        return s === 'completed' || s === 'verified' || s === 'reviewing';
      });
      if (isAllDone) {
        await StorageService.updateUserSession({ isApproved: true });
        router.replace('/(dashboard)');
        return;
      }
    }
    
    router.replace(nextRoute as any);
  } catch (error) {
    console.error('Error in completeStepAndNavigate:', error);
    router.replace('/(tabs)');
  }
}
