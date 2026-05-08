import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

// ─── Sub-screen modal content ────────────────────────────────────────────────

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <View style={modal.sheet}>
      <View style={modal.handle} />
      <Text style={modal.title}>About TRACK</Text>
      <View style={modal.iconWrapper}>
        <Text style={modal.appIcon}>🌱</Text>
      </View>
      <Text style={modal.version}>Version 1.0.0</Text>
      <Text style={modal.body}>
        TRACK is your personal habit-building companion. Build streaks, stay
        consistent, and become the best version of yourself — one small habit
        at a time.
      </Text>
      <Text style={modal.body}>
        Built with ❤️ using React Native & Expo. Designed to be simple,
        beautiful, and distraction-free.
      </Text>
      <Text style={[modal.body, { color: '#4A90D9', fontWeight: '700' }]}>
        © 2026 TRACK App. All rights reserved.
      </Text>
      <TouchableOpacity style={modal.closeBtn} onPress={onClose} activeOpacity={0.85}>
        <Text style={modal.closeBtnText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <View style={modal.sheet}>
      <View style={modal.handle} />
      <Text style={modal.title}>Privacy Policy</Text>
      <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
        {[
          { heading: 'Data We Collect', body: 'We collect only the data you voluntarily enter into the app — your habit names, completion records, and app preferences. No personal identifying information is required.' },
          { heading: 'How We Use It', body: 'Your data is stored locally on your device and is used solely to provide you with habit tracking features, streaks, and progress insights.' },
          { heading: 'Third Parties', body: 'We do not sell, share, or transfer your data to any third parties. Ever.' },
          { heading: 'Data Security', body: 'All data is stored securely on your device. We use industry-standard practices to protect your information.' },
          { heading: 'Your Rights', body: 'You can delete all your data at any time by uninstalling the app. You have full control over your information.' },
          { heading: 'Contact Us', body: 'Questions about privacy? Reach us at privacy@trackapp.io' },
        ].map((s) => (
          <View key={s.heading} style={modal.policySection}>
            <Text style={modal.policyHeading}>{s.heading}</Text>
            <Text style={modal.policyBody}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={modal.closeBtn} onPress={onClose} activeOpacity={0.85}>
        <Text style={modal.closeBtnText}>Got it</Text>
      </TouchableOpacity>
    </View>
  );
}

function TermsModal({ onClose }: { onClose: () => void }) {
  return (
    <View style={modal.sheet}>
      <View style={modal.handle} />
      <Text style={modal.title}>Terms of Service</Text>
      <ScrollView style={{ maxHeight: 380 }} showsVerticalScrollIndicator={false}>
        {[
          { heading: '1. Acceptance', body: 'By using TRACK, you agree to these Terms of Service. If you do not agree, please do not use the app.' },
          { heading: '2. Use of the App', body: 'TRACK is for personal, non-commercial use only. You agree not to misuse the service or attempt to access it using unauthorized methods.' },
          { heading: '3. User Content', body: 'You are responsible for the habit names and content you enter. We do not claim ownership over your personal data.' },
          { heading: '4. Disclaimer', body: 'TRACK is provided "as is" without warranties of any kind. We are not liable for any damages arising from use of the app.' },
          { heading: '5. Changes', body: 'We may update these terms from time to time. Continued use of the app after changes constitutes acceptance of the new terms.' },
          { heading: '6. Contact', body: 'For legal inquiries, contact us at legal@trackapp.io' },
        ].map((s) => (
          <View key={s.heading} style={modal.policySection}>
            <Text style={modal.policyHeading}>{s.heading}</Text>
            <Text style={modal.policyBody}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={modal.closeBtn} onPress={onClose} activeOpacity={0.85}>
        <Text style={modal.closeBtnText}>I Understand</Text>
      </TouchableOpacity>
    </View>
  );
}

function RateModal({ rating, onRate, onClose }: { rating: number; onRate: (n: number) => void; onClose: () => void }) {
  const [hovered, setHovered] = useState(rating);
  const [submitted, setSubmitted] = useState(rating > 0);

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  const handleStar = (n: number) => {
    setHovered(n);
    onRate(n);
    setSubmitted(true);
  };

  return (
    <View style={modal.sheet}>
      <View style={modal.handle} />
      <Text style={modal.title}>Rate TRACK</Text>
      <Text style={modal.body}>
        {submitted
          ? `Thanks for your ${hovered}-star rating! 🎉`
          : 'Enjoying TRACK? Let us know how we\'re doing!'}
      </Text>

      {/* Stars */}
      <View style={rateStyles.starsRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => handleStar(n)}
            activeOpacity={0.7}
            style={rateStyles.starBtn}
          >
            <Text style={[rateStyles.star, n <= hovered && rateStyles.starActive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {hovered > 0 && (
        <Text style={rateStyles.ratingLabel}>{labels[hovered]}</Text>
      )}

      {submitted && (
        <View style={rateStyles.thanksBadge}>
          <Text style={rateStyles.thanksText}>
            {hovered >= 4
              ? '🌟 Amazing! Consider leaving a review on the App Store.'
              : '📝 We\'ll work hard to improve. Thank you!'}
          </Text>
        </View>
      )}

      <TouchableOpacity style={modal.closeBtn} onPress={onClose} activeOpacity={0.85}>
        <Text style={modal.closeBtnText}>{submitted ? 'Done' : 'Maybe Later'}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Settings Screen ─────────────────────────────────────────────────────

type ModalType = 'about' | 'privacy' | 'terms' | 'rate' | null;

export default function SettingsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [reminders, setReminders] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [userRating, setUserRating] = useState(0);

  const handleNotifications = (val: boolean) => {
    setNotifications(val);
    Alert.alert(
      val ? '🔔 Notifications On' : '🔕 Notifications Off',
      val
        ? 'You will receive push notifications for your habits.'
        : 'Push notifications have been disabled.',
      [{ text: 'OK' }]
    );
  };

  const handleDarkMode = (val: boolean) => {
    setDarkMode(val);
    Alert.alert(
      val ? '🌙 Dark Mode' : '☀️ Light Mode',
      val
        ? 'Dark mode enabled. (Full theme switch coming soon!)'
        : 'Light mode enabled.',
      [{ text: 'OK' }]
    );
  };

  const handleReminders = (val: boolean) => {
    setReminders(val);
    Alert.alert(
      val ? '⏰ Reminders On' : '⏰ Reminders Off',
      val
        ? 'You will receive daily habit reminders.'
        : 'Daily reminders have been turned off.',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            // Navigate back to welcome/onboarding screen
            router.replace('/');
          },
        },
      ]
    );
  };

  const toggleItems = [
    { label: '🔔  Push Notifications', value: notifications, setter: handleNotifications },
    { label: '🌙  Dark Mode', value: darkMode, setter: handleDarkMode },
    { label: '⏰  Daily Reminders', value: reminders, setter: handleReminders },
  ];

  const menuItems: { label: string; modal: ModalType; hint: string }[] = [
    { label: 'ℹ️  About', modal: 'about', hint: 'App info & version' },
    { label: '🔒  Privacy Policy', modal: 'privacy', hint: 'How we use your data' },
    { label: '📄  Terms of Service', modal: 'terms', hint: 'Usage terms' },
    {
      label: '⭐  Rate App',
      modal: 'rate',
      hint: userRating > 0 ? `Your rating: ${'★'.repeat(userRating)}` : 'Tell us what you think',
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, darkMode && styles.safeDark]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={[styles.title, darkMode && styles.textDark]}>Settings</Text>

        {/* Toggles */}
        <Text style={[styles.sectionLabel, darkMode && styles.textDarkMuted]}>Preferences</Text>
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          {toggleItems.map((item, i) => (
            <View
              key={item.label}
              style={[
                styles.settingRow,
                i < toggleItems.length - 1 && styles.settingBorder,
                darkMode && styles.settingBorderDark,
              ]}
            >
              <Text style={[styles.settingLabel, darkMode && styles.textDark]}>{item.label}</Text>
              <Switch
                value={item.value}
                onValueChange={item.setter}
                trackColor={{ false: '#E0E0EA', true: '#B8D0E8' }}
                thumbColor={item.value ? '#4A90D9' : '#AAAABC'}
              />
            </View>
          ))}
        </View>

        {/* Menu items */}
        <Text style={[styles.sectionLabel, darkMode && styles.textDarkMuted]}>Information</Text>
        <View style={[styles.section, darkMode && styles.sectionDark]}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.settingRow,
                i < menuItems.length - 1 && styles.settingBorder,
                darkMode && styles.settingBorderDark,
              ]}
              onPress={() => setActiveModal(item.modal)}
              activeOpacity={0.7}
            >
              <View>
                <Text style={[styles.settingLabel, darkMode && styles.textDark]}>{item.label}</Text>
                <Text style={styles.settingHint}>{item.hint}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Text style={styles.logoutText}>🚪  Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>TRACK v1.0.0 · Made with ❤️</Text>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modals ── */}
      <Modal
        visible={activeModal !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={modal.overlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={() => setActiveModal(null)}
          />
          {activeModal === 'about' && <AboutModal onClose={() => setActiveModal(null)} />}
          {activeModal === 'privacy' && <PrivacyModal onClose={() => setActiveModal(null)} />}
          {activeModal === 'terms' && <TermsModal onClose={() => setActiveModal(null)} />}
          {activeModal === 'rate' && (
            <RateModal
              rating={userRating}
              onRate={setUserRating}
              onClose={() => setActiveModal(null)}
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  safeDark: { backgroundColor: '#1A1A2E' },
  content: { paddingHorizontal: 24, paddingTop: 24 },

  title: { fontSize: 36, fontWeight: '800', color: '#1A1A2E', letterSpacing: -0.5, marginBottom: 24 },
  textDark: { color: '#FFFFFF' },
  textDarkMuted: { color: '#8888AA' },

  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#AAAABC', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4 },

  section: { backgroundColor: '#F8F8FC', borderRadius: 16, marginBottom: 24, overflow: 'hidden' },
  sectionDark: { backgroundColor: '#252540' },

  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 18 },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: '#EBEBF5' },
  settingBorderDark: { borderBottomColor: '#33334A' },

  settingLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A2E' },
  settingHint: { fontSize: 12, color: '#AAAABC', marginTop: 2 },
  arrow: { fontSize: 22, color: '#CCCCDA', fontWeight: '300' },

  logoutBtn: {
    backgroundColor: '#FF7B6B', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: '#CC4A38', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
  },
  logoutText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  footerText: { textAlign: 'center', color: '#CCCCDA', fontSize: 12, marginTop: 20 },
});

const modal = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 16,
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E0E0EA', alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#1A1A2E', marginBottom: 12 },
  iconWrapper: { alignItems: 'center', marginVertical: 8 },
  appIcon: { fontSize: 56 },
  version: { textAlign: 'center', fontSize: 13, color: '#AAAABC', marginBottom: 12 },
  body: { fontSize: 15, color: '#555570', lineHeight: 22, marginBottom: 10 },
  policySection: { marginBottom: 16 },
  policyHeading: { fontSize: 15, fontWeight: '800', color: '#1A1A2E', marginBottom: 4 },
  policyBody: { fontSize: 14, color: '#666677', lineHeight: 20 },
  closeBtn: {
    backgroundColor: '#4BC8C8', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginTop: 16,
  },
  closeBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});

const rateStyles = StyleSheet.create({
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 16 },
  starBtn: { padding: 6 },
  star: { fontSize: 44, color: '#E0E0EA' },
  starActive: { color: '#F0C030' },
  ratingLabel: { textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 8 },
  thanksBadge: {
    backgroundColor: '#F5F5FA', borderRadius: 12,
    padding: 14, marginTop: 4,
  },
  thanksText: { fontSize: 14, color: '#555570', textAlign: 'center', lineHeight: 20 },
});