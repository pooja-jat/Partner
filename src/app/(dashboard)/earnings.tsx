import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { BackArrowIcon } from '@/components/ui/Icons';
import { useAndroidBack } from '@/hooks/useAndroidBack';
import { useAuthStore } from '@/store/authStore';
import Svg, { Path } from 'react-native-svg';

const PRIMARY = 'rgba(26, 15, 163, 1.00)';

const ChevronLeftIcon = ({ size = 16, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M15 19l-7-7 7-7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = 'rgba(26, 15, 163, 1.00)' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 5l7 7-7 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface BookingItem {
  id: string;
  service: string;
  date: Date;
  amount: number;
  status: 'Completed' | 'Canceled' | 'Missed';
}

// BSP Mock Data
const BSP_HISTORY: BookingItem[] = [
  { id: 'B001', service: 'Water Purifier Repair', date: new Date(2024, 4, 7, 16, 0), amount: 600.00, status: 'Completed' },
  { id: 'B002', service: 'AC Repair', date: new Date(2024, 4, 8, 9, 0), amount: 484.22, status: 'Completed' },
  { id: 'B003', service: 'RO Installation', date: new Date(2024, 4, 8, 11, 30), amount: 442.22, status: 'Completed' },
  { id: 'B004', service: 'Washing Machine Repair', date: new Date(2024, 4, 8, 14, 0), amount: 0.00, status: 'Canceled' },
  { id: 'B005', service: 'AC Servicing', date: new Date(2024, 4, 8, 15, 30), amount: 0.00, status: 'Missed' },
];

// BS Mock Data
const BS_HISTORY: BookingItem[] = [
  { id: 'ORD001', service: 'AC Deep Cleaning Material', date: new Date(2024, 4, 7, 16, 0), amount: 1299.00, status: 'Completed' },
  { id: 'ORD002', service: 'Gas Refilling Gas (R32)', date: new Date(2024, 4, 8, 9, 0), amount: 595.44, status: 'Completed' },
  { id: 'ORD003', service: 'Tap Leakage Material', date: new Date(2024, 4, 8, 14, 0), amount: 0.00, status: 'Canceled' },
  { id: 'ORD004', service: 'Wiring Cables', date: new Date(2024, 4, 8, 15, 30), amount: 0.00, status: 'Missed' },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getDayWindow(centerDate: Date) {
  const result = [];
  for (let i = -1; i <= 1; i++) {
    const d = new Date(centerDate);
    d.setDate(centerDate.getDate() + i);
    result.push(d);
  }
  return result;
}

function getWeekDays(weekStart: Date) {
  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    result.push(d);
  }
  return result;
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  return cells;
}

const formatDateString = (date: Date) => {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

export default function EarningsScreen() {
  const router = useSafeRouter();
  useAndroidBack(() => router.back());
  const role = useAuthStore(state => state.role);

  const [periodTab, setPeriodTab] = useState<'Day' | 'Week' | 'Month'>('Day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 4, 8)); // 8 May 2024
  const [viewMonth, setViewMonth] = useState<Date>(new Date(2024, 4, 8)); // May 2024
  const [historyTab, setHistoryTab] = useState<'Completed' | 'Canceled' | 'Missed'>('Completed');

  const isBS = role === 'BS';
  const rawHistory = isBS ? BS_HISTORY : BSP_HISTORY;

  const weekStart = getWeekStart(selectedDate);
  const weekDays = getWeekDays(weekStart);
  const monthCells = getMonthDays(viewMonth.getFullYear(), viewMonth.getMonth());

  // Filter raw history data based on active period and selected date
  const getFilteredBookings = (status: 'Completed' | 'Canceled' | 'Missed') => {
    return rawHistory.filter(item => {
      if (item.status !== status) return false;

      if (periodTab === 'Day') {
        return isSameDay(item.date, selectedDate);
      } else if (periodTab === 'Week') {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return item.date >= weekStart && item.date < weekEnd;
      } else {
        return (
          item.date.getFullYear() === viewMonth.getFullYear() &&
          item.date.getMonth() === viewMonth.getMonth()
        );
      }
    });
  };

  const listItems = getFilteredBookings(historyTab);

  // Calculate stats dynamically
  const getStats = () => {
    const completedItems = getFilteredBookings('Completed');
    const totalEarnings = completedItems.reduce((sum, item) => sum + item.amount, 0);
    return {
      count: completedItems.length,
      earnings: `₹${Math.round(totalEarnings)}`,
    };
  };

  const stats = getStats();

  return (
    <GradientBackground style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        
        {/* Navigation Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <BackArrowIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isBS ? 'Order Earnings' : 'Booking Earnings'}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Day / Week / Month selector */}
          <View style={styles.periodTabsWrapper}>
            {(['Day', 'Week', 'Month'] as const).map(tab => {
              const isActive = periodTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.periodTab, isActive && styles.periodTabActive]}
                  onPress={() => setPeriodTab(tab)}
                  activeOpacity={0.9}
                >
                  <Text style={[styles.periodTabText, isActive && styles.periodTabTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Day View Calendar Carousel */}
          {periodTab === 'Day' && (
            <View style={styles.calendarWrapper}>
              <TouchableOpacity 
                style={styles.calendarArrowBtn} 
                onPress={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() - 1);
                  setSelectedDate(d);
                }}
              >
                <ChevronLeftIcon size={16} />
              </TouchableOpacity>

              {getDayWindow(selectedDate).map((date, idx) => {
                const isActive = idx === 1;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.calendarCard, isActive && styles.calendarCardActive]}
                    onPress={() => setSelectedDate(date)}
                    activeOpacity={0.9}
                  >
                    <Text style={[styles.calendarDayText, isActive && styles.calendarDayTextActive]}>
                      {DAY_NAMES[date.getDay()]}
                    </Text>
                    <Text style={[styles.calendarDateText, isActive && styles.calendarDateTextActive]}>
                      {String(date.getDate()).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity 
                style={styles.calendarArrowBtn} 
                onPress={() => {
                  const d = new Date(selectedDate);
                  d.setDate(d.getDate() + 1);
                  setSelectedDate(d);
                }}
              >
                <ChevronRightIcon size={16} />
              </TouchableOpacity>
            </View>
          )}

          {/* Week View Calendar Carousel */}
          {periodTab === 'Week' && (
            <View>
              <View style={styles.calendarWrapper}>
                <TouchableOpacity 
                  style={styles.calendarArrowBtn} 
                  onPress={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - 7);
                    setSelectedDate(d);
                  }}
                >
                  <ChevronLeftIcon size={16} />
                </TouchableOpacity>
                <Text style={styles.weekRangeText}>
                  {`${String(weekDays[0].getDate()).padStart(2, '0')} ${MONTH_NAMES[weekDays[0].getMonth()]} – ${String(weekDays[6].getDate()).padStart(2, '0')} ${MONTH_NAMES[weekDays[6].getMonth()]} ${weekDays[6].getFullYear()}`}
                </Text>
                <TouchableOpacity 
                  style={styles.calendarArrowBtn} 
                  onPress={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 7);
                    setSelectedDate(d);
                  }}
                >
                  <ChevronRightIcon size={16} />
                </TouchableOpacity>
              </View>

              <View style={styles.weekDaysRow}>
                {weekDays.map((date, idx) => {
                  const isActive = isSameDay(date, selectedDate);
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[styles.weekPill, isActive && styles.weekPillActive]}
                      onPress={() => setSelectedDate(date)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.weekPillDay, isActive && styles.weekPillDayActive]}>
                        {DAY_NAMES[date.getDay()]}
                      </Text>
                      <Text style={[styles.weekPillNum, isActive && styles.weekPillNumActive]}>
                        {String(date.getDate()).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Month View Calendar Carousel */}
          {periodTab === 'Month' && (
            <View>
              <View style={styles.calendarWrapper}>
                <TouchableOpacity 
                  style={styles.calendarArrowBtn} 
                  onPress={() => {
                    const d = new Date(viewMonth);
                    d.setMonth(d.getMonth() - 1);
                    setViewMonth(d);
                  }}
                >
                  <ChevronLeftIcon size={16} />
                </TouchableOpacity>
                <Text style={styles.weekRangeText}>
                  {`${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`}
                </Text>
                <TouchableOpacity 
                  style={styles.calendarArrowBtn} 
                  onPress={() => {
                    const d = new Date(viewMonth);
                    d.setMonth(d.getMonth() + 1);
                    setViewMonth(d);
                  }}
                >
                  <ChevronRightIcon size={16} />
                </TouchableOpacity>
              </View>

              <View style={styles.monthDayNamesRow}>
                {DAY_NAMES.map(n => (
                  <Text key={n} style={styles.monthDayName}>{n}</Text>
                ))}
              </View>

              <View style={styles.monthGrid}>
                {monthCells.map((date, idx) => {
                  if (!date) return <View key={idx} style={styles.monthCell} />;
                  const isActive = isSameDay(date, selectedDate);
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={styles.monthCell}
                      onPress={() => {
                        setSelectedDate(date);
                        setViewMonth(date);
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.monthCellInner, isActive && styles.monthCellInnerActive]}>
                        <Text style={[styles.monthCellText, isActive && styles.monthCellTextActive]}>
                          {date.getDate()}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Core Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statsCol}>
              <Text style={styles.statsValue}>{stats.count}</Text>
              <Text style={styles.statsLabel}>{isBS ? 'Completed Orders' : 'Completed Bookings'}</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsCol}>
              <Text style={[styles.statsValue, { color: 'rgba(26, 15, 163, 1.00)' }]}>{stats.earnings}</Text>
              <Text style={styles.statsLabel}>{isBS ? 'Total Order Earnings' : 'Total Booking Earnings'}</Text>
            </View>
          </View>

          {/* Rate Card Row (Only for BSP/ISP partners) */}
          {!isBS && (
            <TouchableOpacity 
              style={styles.rateCardRow} 
              onPress={() => router.push('/(dashboard)/rate-card')}
              activeOpacity={0.8}
            >
              <View style={styles.rupeeIconBadge}>
                <Text style={styles.rupeeIconText}>₹</Text>
              </View>
              <Text style={styles.rateCardText}>View Rate Card</Text>
              <ChevronRightIcon size={14} color="#94A3B8" />
            </TouchableOpacity>
          )}

          {/* History List Heading */}
          <Text style={styles.historyHeading}>{isBS ? 'Order History' : 'Booking History'}</Text>

          {/* Filter Chips */}
          <View style={styles.chipsRow}>
            {(['Completed', 'Canceled', 'Missed'] as const).map(tab => {
              const isActive = historyTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => setHistoryTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Booking Cards List */}
          {listItems.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No {historyTab.toLowerCase()} items</Text>
            </View>
          ) : (
            listItems.map(item => {
              const statusColor = item.status === 'Completed' ? '#16A34A' : '#EF4444';
              return (
                <View key={item.id} style={styles.bookingCard}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardTitle}>{item.service}</Text>
                    <Text style={styles.cardSubtitle}>
                      {formatDateString(item.date)} • <Text style={{ color: statusColor }}>{item.status}</Text>
                    </Text>
                  </View>
                  <View style={styles.cardRight}>
                    <View style={styles.earningLabelWrapper}>
                      <Text style={styles.earningLabel}>{isBS ? 'REVENUE' : 'EARNING'}</Text>
                      <Text style={styles.earningAmount}>₹{item.amount.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.viewBtn} 
                      onPress={() => router.push(`/(dashboard)/bookings/${item.id}` as any)}
                    >
                      <Text style={styles.viewBtnText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}

        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16 
  },
  backBtn: { marginRight: 16 },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#0F172A' 
  },

  scrollContent: { 
    paddingBottom: 40 
  },

  periodTabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 1,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodTabActive: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
  },
  periodTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  periodTabTextActive: {
    color: '#FFFFFF',
  },

  calendarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  calendarArrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  calendarCard: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  calendarCardActive: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    borderColor: 'rgba(26, 15, 163, 1.00)',
  },
  calendarDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  calendarDayTextActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  calendarDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  calendarDateTextActive: {
    color: '#FFFFFF',
  },

  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 20,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 3,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      }
    }),
  },
  statsCol: {
    flex: 1,
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A0FA3',
    marginBottom: 6,
  },
  statsLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  statsDivider: {
    width: 1,
    height: 48,
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },

  rateCardRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  rupeeIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rupeeIconText: {
    fontSize: 16,
    color: 'rgba(26, 15, 163, 1.00)',
    fontWeight: '800',
  },
  rateCardText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginLeft: 12,
    flex: 1,
  },

  historyHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginHorizontal: 20,
    marginBottom: 16,
  },

  chipsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 1,
  },
  chipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: 'rgba(26, 15, 163, 1.00)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  chipTextActive: {
    color: 'rgba(26, 15, 163, 1.00)',
  },

  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  cardLeft: {
    flex: 1.3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  cardRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  earningLabelWrapper: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  earningLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  earningAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: 'rgba(26, 15, 163, 1.00)',
  },
  viewBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(26, 15, 163, 1.00)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(26, 15, 163, 1.00)',
  },

  emptyBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
  },

  // Week View Styles
  weekRangeText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  weekPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      }
    }),
  },
  weekPillActive: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    borderColor: 'rgba(26, 15, 163, 1.00)',
  },
  weekPillDay: { fontSize: 10, color: '#64748B', marginBottom: 4 },
  weekPillDayActive: { color: 'rgba(255, 255, 255, 0.8)' },
  weekPillNum: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  weekPillNumActive: { color: '#FFFFFF' },

  // Month View Styles
  monthDayNamesRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 8,
  },
  monthDayName: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  monthCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCellInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  monthCellInnerActive: {
    backgroundColor: 'rgba(26, 15, 163, 1.00)',
    borderColor: 'rgba(26, 15, 163, 1.00)',
  },
  monthCellText: { fontSize: 12, color: '#0F172A', fontWeight: '500' },
  monthCellTextActive: { color: '#FFFFFF', fontWeight: '700' },
});
