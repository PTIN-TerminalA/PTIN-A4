import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Schedule } from '@/constants/mocks/mockTypes';


interface ScheduleStatusProps {
  schedules: Schedule[];
}

export default function ScheduleStatus({ schedules }: ScheduleStatusProps) {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    
    // Catalan day names in order (Sunday to Saturday)
    const daysOrder = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'];
    const today = new Date();
    const currentDayIndex = (today.getDay() + 6) % 7
    const currentDay = daysOrder[currentDayIndex];
    const currentTime = today.getHours() * 100 + today.getMinutes();
  
    // Check if currently open
    const isOpen = (schedule: Schedule) => {
      const [openHour, openMinute] = schedule.opening_hour.split(':').map(Number);
      const [closeHour, closeMinute] = schedule.closing_hour.split(':').map(Number);
      
      const openTime = openHour * 100 + openMinute;
      const closeTime = closeHour * 100 + closeMinute;
      
      return currentTime >= openTime && currentTime <= closeTime;
    };
  
    // Format hours display
    const formatHours = (schedule: Schedule) => {
      return `${schedule.opening_hour} - ${schedule.closing_hour}`;
    };
  
    // Find today's schedule
    const todaySchedule = schedules.find(s => s.day === currentDay);
  
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Today's Schedule (Highlighted) */}
        {todaySchedule && (
          <View style={[styles.todayContainer, { borderColor: colors.tint }]}>
            <View style={styles.statusRow}>
              <Text style={[styles.dayText, { color: colors.text, fontWeight: 'bold' }]}>
                AVUI ({currentDay.toUpperCase()})
              </Text>
              <View style={styles.statusIndicator}>
                <View 
                  style={[
                    styles.statusDot,
                    { backgroundColor: isOpen(todaySchedule) ? 'green' : 'red' }
                  ]} 
                />
                <Text style={[
                  styles.statusText,
                  { color: isOpen(todaySchedule) ? 'green' : 'red' }
                ]}>
                  {isOpen(todaySchedule) ? 'OBERT' : 'TANCAT'}
                </Text>
              </View>
            </View>
            <Text style={[styles.hoursText, { color: colors.text }]}>
              {formatHours(todaySchedule)}
            </Text>
          </View>
        )}
  
        {/* Full Week Schedule */}
        <View style={styles.scheduleList}>
          {daysOrder.map(day => {
            const daySchedule = schedules.find(s => s.day === day);
            const isToday = day === currentDay;
            
            return (
              <View 
                key={day} 
                style={[
                  styles.scheduleRow,
                  isToday && { backgroundColor: colors.box }
                ]}
              >
                <Text style={[
                  styles.dayText, 
                  { color: colors.text },
                  isToday && { fontWeight: 'bold' }
                ]}>
                  {day}
                </Text>
                <Text style={[
                  styles.hoursText, 
                  { color: colors.text },
                  isToday && { fontWeight: 'bold' }
                ]}>
                  {daySchedule ? formatHours(daySchedule) : '--'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: 8,
      marginVertical: 8,
    },
    todayContainer: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    statusIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    statusText: {
      fontSize: 14,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    dayText: {
      fontSize: 14,
      flex: 1,
    },
    hoursText: {
      fontSize: 14,
      flex: 1,
      textAlign: 'right',
    },
    scheduleList: {
      gap: 8,
    },
    scheduleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
      paddingHorizontal: 4,
      borderRadius: 4,
    },
  });