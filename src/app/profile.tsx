import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────
type CompletedMap = Record<string, Record<string, boolean>>;
// key format: "YYYY-M-D"

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${month}-${day}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// ─── Streak calculator ────────────────────────────────────────────────────────
function computeStreaks(
  completedSet: Record<string, boolean>,
  today: Date,
): { current: number; longest: number } {
  const keys = Object.keys(completedSet).filter((k) => completedSet[k]);
  if (!keys.length) return { current: 0, longest: 0 };

  const dates = keys
    .map((k) => {
      const [y, m, d] = k.split('-').map(Number);
      return new Date(y, m, d).getTime();
    })
    .sort((a, b) => a - b);

  // Longest streak
  let longest = 1;
  let cur = 1;
  for (let i = 1; i < dates.length; i++) {
    const diffDays = (dates[i] - dates[i - 1]) / 86400000;
    if (diffDays === 1) {
      cur++;
      if (cur > longest) longest = cur;
    } else {
      cur = 1;
    }
  }

  // Current streak (backwards from today)
  let current = 0;
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const check = new Date(t);
  while (true) {
    const k = dateKey(check.getFullYear(), check.getMonth(), check.getDate());
    if (completedSet[k]) {
      current++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  return { current, longest };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProgressScreen() {
  const today = new Date();

  const [habits, setHabits] = useState<string[]>([
    'Drink Water', 'Run', 'Water Plants', 'Meditate', 'Wake up early',
  ]);

  // completedDates[habitName][dateKey] = true/false
  const [completedDates, setCompletedDates] = useState<CompletedMap>({
    'Drink Water': {},
    'Run': {},
    'Water Plants': {},
    'Meditate': {},
    'Wake up early': {},
  });

  const [selectedHabit, setSelectedHabit] = useState<string>('Drink Water');
  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(today.getMonth());

  // Edit modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState('');

  // ── Calendar navigation ────────────────────────────────────────────────────
  const changeMonth = (delta: number) => {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setViewMonth(m);
    setViewYear(y);
  };

  // ── Toggle a day ──────────────────────────────────────────────────────────
  const toggleDate = (day: number) => {
    const key = dateKey(viewYear, viewMonth, day);
    setCompletedDates((prev) => {
      const habitMap = { ...(prev[selectedHabit] ?? {}) };
      if (habitMap[key]) {
        delete habitMap[key];
      } else {
        habitMap[key] = true;
      }
      return { ...prev, [selectedHabit]: habitMap };
    });
  };

  // ── Build calendar cells ──────────────────────────────────────────────────
  const buildCalendar = (): (number | null)[] => {
    const cells: (number | null)[] = [];
    const start = firstDayOfMonth(viewYear, viewMonth);
    const total = daysInMonth(viewYear, viewMonth);
    for (let i = 0; i < start; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  };

  // ── Day status ────────────────────────────────────────────────────────────
  type DayStatus = 'today' | 'completed' | 'missed' | 'future' | 'empty';

  const getDayStatus = (day: number): DayStatus => {
    const key = dateKey(viewYear, viewMonth, day);
    const set = completedDates[selectedHabit] ?? {};
    const cellDate = new Date(viewYear, viewMonth, day);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday = cellDate.getTime() === todayDate.getTime();
    const isPast = cellDate < todayDate;
    const isCompleted = !!set[key];

    if (isCompleted) return 'completed';   // yellow  (takes priority)
    if (isToday) return 'today';           // blue circle
    if (isPast) return 'missed';           // red
    return 'future';                        // grey
  };

  // ── Streaks ───────────────────────────────────────────────────────────────
  const { current: thisStreak, longest: longestStreak } = computeStreaks(
    completedDates[selectedHabit] ?? {},
    today,
  );

  // ── Edit habit ────────────────────────────────────────────────────────────
  const openEdit = () => {
    setEditName(selectedHabit);
    setModalVisible(true);
  };

  const saveHabit = () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      Alert.alert('Name cannot be empty');
      return;
    }
    if (trimmed === selectedHabit) {
      setModalVisible(false);
      return;
    }
    if (habits.includes(trimmed)) {
      Alert.alert('A habit with this name already exists');
      return;
    }
    setHabits((prev) => prev.map((h) => (h === selectedHabit ? trimmed : h)));
    setCompletedDates((prev) => {
      const updated: CompletedMap = { ...prev, [trimmed]: prev[selectedHabit] ?? {} };
      delete updated[selectedHabit];
      return updated;
    });
    setSelectedHabit(trimmed);
    setModalVisible(false);
  };

  const deleteHabit = () => {
    if (habits.length <= 1) {
      Alert.alert('You need at least one habit!');
      return;
    }
    Alert.alert('Delete Habit', `Delete "${selectedHabit}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: () => {
          const idx = habits.indexOf(selectedHabit);
          const newHabits = habits.filter((h) => h !== selectedHabit);
          setCompletedDates((prev) => {
            const updated = { ...prev };
            delete updated[selectedHabit];
            return updated;
          });
          setHabits(newHabits);
          setSelectedHabit(newHabits[Math.max(0, idx - 1)]);
          setModalVisible(false);
        },
      },
    ]);
  };

  const cells = buildCalendar();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Text style={styles.title}>Progress</Text>

        {/* ── Habit Selector ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.habitScroll}
        >
          {habits.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.habitChip, selectedHabit === h && styles.habitChipActive]}
              onPress={() => setSelectedHabit(h)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.habitChipText,
                  selectedHabit === h && styles.habitChipTextActive,
                ]}
              >
                {h}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Calendar Card ── */}
        <View style={styles.calendarCard}>
          {/* Month nav */}
          <View style={styles.monthNav}>
            <TouchableOpacity style={styles.navBtn} onPress={() => changeMonth(-1)}>
              <Text style={styles.navArrow}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthLabel}>
              {MONTHS[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity style={styles.navBtn} onPress={() => changeMonth(1)}>
              <Text style={styles.navArrow}>{'›'}</Text>
            </TouchableOpacity>
          </View>

          {/* Day-of-week headers */}
          <View style={styles.calendarGrid}>
            {DAYS_OF_WEEK.map((d, i) => (
              <View key={`h-${i}`} style={styles.calCell}>
                <Text style={styles.dayHeader}>{d}</Text>
              </View>
            ))}

            {/* Date cells */}
            {cells.map((date, i) => {
              if (date === null) {
                return <View key={`e-${i}`} style={styles.calCell} />;
              }

              const status = getDayStatus(date);
              const isSunday = new Date(viewYear, viewMonth, date).getDay() === 0;

              return (
                <TouchableOpacity
                  key={`c-${i}`}
                  style={styles.calCell}
                  onPress={() => toggleDate(date)}
                  activeOpacity={0.75}
                >
                  <View
                    style={[
                      styles.dateCircle,
                      status === 'today'     && styles.dateCircleToday,
                      status === 'completed' && styles.dateCircleCompleted,
                      status === 'missed'    && styles.dateCircleMissed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        // Sunday text = blue ONLY when not completed/missed/today
                        isSunday && status === 'future' && styles.dateTextSunday,
                        status === 'today'     && styles.dateTextToday,
                        status === 'completed' && styles.dateTextCompleted,
                        status === 'missed'    && styles.dateTextMissed,
                      ]}
                    >
                      {date}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Legend ── */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4A90D9' }]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F0E06A' }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.legendText}>Missed</Text>
          </View>
        </View>

        {/* ── Streak info banner ── */}
        <View style={styles.streakBanner}>
          <Text style={styles.streakBannerText}>
            {thisStreak > 0
              ? `🔥 You're on a ${thisStreak}-day streak! Keep it up!`
              : 'Tap any date to mark it as completed'}
          </Text>
        </View>

        {/* ── Streak Stats ── */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>This Streak</Text>
            <Text style={styles.statValue}>{thisStreak} days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Longest Streak</Text>
            <Text style={styles.statValue}>{longestStreak} days</Text>
          </View>
        </View>

        {/* ── Edit Habit Button ── */}
        <TouchableOpacity style={styles.editBtn} onPress={openEdit} activeOpacity={0.85}>
          <Text style={styles.editBtnText}>Edit Habit</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Edit Habit Modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Habit</Text>

            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Habit name..."
              placeholderTextColor="#AAAABC"
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={saveHabit}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={deleteHabit}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteBtnText}>🗑  Delete this habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5FB',
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 28,
  },

  // ── Header ──
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
    marginBottom: 16,
  },

  // ── Habit chips ──
  habitScroll: {
    marginBottom: 20,
  },
  habitChip: {
    backgroundColor: '#EBEBF5',
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 18,
    marginRight: 10,
    height: 40,
    justifyContent: 'center',
  },
  habitChipActive: {
    backgroundColor: '#B8C8E8',
  },
  habitChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888899',
  },
  habitChipTextActive: {
    color: '#1A1A2E',
  },

  // ── Calendar card ──
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 14,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  navBtn: {
    padding: 8,
  },
  navArrow: {
    fontSize: 22,
    fontWeight: '800',
    color: '#888899',
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.285%',
    alignItems: 'center',
    marginBottom: 4,
    paddingVertical: 2,
  },
  dayHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#AAAABC',
    marginBottom: 4,
  },
  dateCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Today → blue background
  dateCircleToday: {
    backgroundColor: '#4A90D9',
  },
  // Completed → yellow background
  dateCircleCompleted: {
    backgroundColor: '#F0E06A',
  },
  // Missed → red background
  dateCircleMissed: {
    backgroundColor: '#FF6B6B',
  },

  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666677',
  },
  // Sunday text in blue (only for future/uncolored days)
  dateTextSunday: {
    color: '#4A90D9',
    fontWeight: '800',
  },
  dateTextToday: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dateTextCompleted: {
    color: '#1A1A2E',
    fontWeight: '800',
  },
  dateTextMissed: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── Legend ──
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 14,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888899',
  },

  // ── Streak banner ──
  streakBanner: {
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  streakBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8A6D00',
    textAlign: 'center',
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0EA',
  },
  statLabel: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888899',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4A90D9',
  },

  // ── Edit button ──
  editBtn: {
    backgroundColor: '#F08AB0',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#C05080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 18,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#E0E0EA',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F0F0F8',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888899',
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#F08AB0',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  deleteBtn: {
    borderWidth: 2,
    borderColor: '#FFCDD2',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  deleteBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E53935',
  },
});