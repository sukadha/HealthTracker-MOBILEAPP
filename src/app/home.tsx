import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const HABIT_COLORS = [
  '#B8D0E8', '#F0B8C8', '#F0A090', '#7090C8',
  '#A8D8A8', '#D8B8E8', '#F0D8A0', '#90C8D0',
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function buildWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Start from Monday

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: DAY_LABELS[d.getDay()],
      date: d.getDate().toString(),
      fullDate: d.toDateString(),
      isToday: d.toDateString() === today.toDateString(),
    };
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

let nextId = 10;

export default function HomeScreen() {
  const today = new Date();
  const weekDays = useMemo(() => buildWeekDays(), []);

  const [selectedDay, setSelectedDay] = useState(today.toDateString());
  const [todos, setTodos] = useState([
    { id: '1', name: 'Drink Water', color: '#B8D0E8' },
    { id: '2', name: 'Run', color: '#F0B8C8' },
    { id: '3', name: 'Water Plants', color: '#F0A090' },
    { id: '4', name: 'Meditate', color: '#7090C8' },
  ]);
  const [done, setDone] = useState([
    { id: '5', name: 'Wake up early', color: '#F0E06A' },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  const handleToggleTodo = (id: string) => {
    const item = todos.find((t) => t.id === id);
    if (!item) return;
    setTodos((p) => p.filter((t) => t.id !== id));
    setDone((p) => [item, ...p]);
  };

  const handleRemoveDone = (id: string) => {
    setDone((p) => p.filter((d) => d.id !== id));
  };

  const handleSubmitHabit = () => {
    const name = newHabitName.trim();
    if (!name) return;
    nextId += 1;
    const color = HABIT_COLORS[nextId % HABIT_COLORS.length];
    setTodos((p) => [...p, { id: String(nextId), name, color }]);
    setNewHabitName('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={styles.title}>Today.</Text>
        <Text style={styles.dateText}>{formatDate(selectedDay)}</Text>

        {/* Week strip — tap any day */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekRow}>
          {weekDays.map((d) => {
            const isSelected = d.fullDate === selectedDay;
            return (
              <TouchableOpacity
                key={d.fullDate}
                style={[
                  styles.dayChip,
                  isSelected && styles.dayChipActive,
                  d.isToday && !isSelected && styles.dayChipToday,
                ]}
                onPress={() => setSelectedDay(d.fullDate)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.dayLabel,
                  isSelected && styles.dayLabelActive,
                  d.isToday && !isSelected && styles.dayLabelToday,
                ]}>
                  {d.label}
                </Text>
                <Text style={[
                  styles.dayDate,
                  isSelected && styles.dayDateActive,
                  d.isToday && !isSelected && styles.dayDateToday,
                ]}>
                  {d.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* To Do */}
        <Text style={styles.sectionTitle}>To Do</Text>
        {todos.length === 0 && (
          <Text style={styles.emptyText}>All done! 🎉 Add a new habit below.</Text>
        )}
        {todos.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.habitCard, { backgroundColor: item.color }]}
            onPress={() => handleToggleTodo(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.habitName}>{item.name}</Text>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Done */}
        {done.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Done</Text>
            {done.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.habitCard, { backgroundColor: item.color }]}
                onPress={() => handleRemoveDone(item.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.habitName, styles.habitNameDone]}>{item.name}</Text>
                <View style={[styles.checkCircle, styles.checkCircleDone]}>
                  <Text style={[styles.checkMark, { color: '#E05050' }]}>✕</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Add button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>+ Add New Habit</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Add Habit Modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Backdrop tap to close */}
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>New Habit 🌱</Text>
            <Text style={styles.modalSubtitle}>What habit do you want to build?</Text>

            <TextInput
              style={styles.textInput}
              placeholder="e.g. Read for 20 minutes"
              placeholderTextColor="#AAAABC"
              value={newHabitName}
              onChangeText={setNewHabitName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleSubmitHabit}
              maxLength={50}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setNewHabitName(''); setModalVisible(false); }}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitBtn, !newHabitName.trim() && styles.submitBtnDisabled]}
                onPress={handleSubmitHabit}
                disabled={!newHabitName.trim()}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Add Habit ✓</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 24 },

  title: { fontSize: 36, fontWeight: '800', color: '#1A1A2E', letterSpacing: -0.5 },
  dateText: { fontSize: 14, color: '#888899', fontStyle: 'italic', marginBottom: 16, marginTop: 2 },

  weekRow: { marginBottom: 24 },
  dayChip: {
    alignItems: 'center', justifyContent: 'center',
    width: 44, height: 58, borderRadius: 12,
    backgroundColor: '#F5F5FA', marginRight: 8,
  },
  dayChipActive: { backgroundColor: '#FF7B6B' },
  dayChipToday: { backgroundColor: '#FFF0EE', borderWidth: 2, borderColor: '#FF7B6B' },
  dayLabel: { fontSize: 11, fontWeight: '600', color: '#AAAABC', marginBottom: 4 },
  dayLabelActive: { color: '#FFFFFF' },
  dayLabelToday: { color: '#FF7B6B' },
  dayDate: { fontSize: 16, fontWeight: '800', color: '#1A1A2E' },
  dayDateActive: { color: '#FFFFFF' },
  dayDateToday: { color: '#FF7B6B' },

  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A2E', marginBottom: 12, marginTop: 4 },
  emptyText: { fontSize: 14, color: '#AAAABC', fontStyle: 'italic', marginBottom: 12, textAlign: 'center', paddingVertical: 8 },

  habitCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 18, marginBottom: 10,
  },
  habitName: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  habitNameDone: { color: '#5A4A00' },
  checkCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  checkCircleDone: { backgroundColor: 'rgba(255,255,255,0.5)' },
  checkMark: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },

  addBtn: {
    backgroundColor: '#4BC8C8', borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginTop: 16,
    shadowColor: '#2A9898', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  addBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 16,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E0E0EA', alignSelf: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: '#888899', marginBottom: 20 },
  textInput: {
    backgroundColor: '#F5F5FA', borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 14,
    fontSize: 16, fontWeight: '500', color: '#1A1A2E',
    borderWidth: 2, borderColor: '#EEEEF8', marginBottom: 20,
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1, backgroundColor: '#F5F5FA',
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#888899' },
  submitBtn: {
    flex: 2, backgroundColor: '#4BC8C8',
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    shadowColor: '#2A9898', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 4,
  },
  submitBtnDisabled: { backgroundColor: '#B8E8E8', shadowOpacity: 0, elevation: 0 },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});