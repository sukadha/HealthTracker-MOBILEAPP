import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top sky/illustration area */}
        <View style={styles.illustrationArea}>
          {/* Cloud decorations */}
          {/* <View style={[styles.cloud, { top: 30, left: 20, width: 80, height: 30 }]} />
          <View style={[styles.cloud, { top: 20, left: 80, width: 50, height: 20 }]} />
          <View style={[styles.cloud, { top: 50, right: 30, width: 70, height: 25 }]} />
          <View style={[styles.cloud, { top: 80, right: 60, width: 40, height: 16 }]} /> */}

          {/* Greeting */}
          <Text style={styles.greeting}>Hi, Sukadha.</Text>

          {/* Character illustration placeholder */}
          <View style={styles.characterWrapper}>
            {/* Speech bubble */}
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>Let's{'\n'}Start!</Text>
              <View style={styles.speechTail} />
            </View>

            {/* Simple character avatar */}
            <View style={styles.character}>
              {/* Head */}
              <View style={styles.head}>
                <View style={styles.hair} />
                {/* Glasses */}
                <View style={styles.glassesRow}>
                  <View style={styles.glassLens} />
                  <View style={styles.glassBridge} />
                  <View style={styles.glassLens} />
                </View>
                {/* Smile */}
                <View style={styles.smile} />
              </View>
              {/* Body */}
              <View style={styles.body} />
              {/* Arm raised */}
              <View style={styles.armRight} />
              <View style={styles.armLeft} />
            </View>
          </View>
        </View>

        {/* Bottom content */}
        <View style={styles.bottomContent}>
          <Text style={styles.subText}>Are you ready</Text>
          <Text style={styles.boldText}>to build some habits?</Text>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => router.push('/home')}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => router.push('/home')}
          >
            {/* <Text style={styles.arrowText}>→</Text> */}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  illustrationArea: {
    flex: 1,
    backgroundColor: '#C8D8F0',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    paddingVertical: 40,
    overflow: 'hidden',
    paddingHorizontal: 30,
    paddingTop: 59,
    alignItems: 'flex-start',
  },
  // cloud: {
  //   position: 'absolute',
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 20,
  //   opacity: 0.85,
  // },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A2E',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  characterWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  speechBubble: {
    position: 'absolute',
    top: 40,
    right: 70,
    backgroundColor: '#f1796b',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 15,
    zIndex: 10,
    transform: [{ rotate: '-5deg' }],
  },
  speechText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
  },
  speechTail: {
    position: 'absolute',
    bottom: -10,
    left: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF7B6B',
  },
  character: {
    alignItems: 'center',
    marginTop: 40,
  },
  head: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5C5A3',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  hair: {
    position: 'absolute',
    top: -10,
    width: 80,
    height: 50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#1A1A2E',
  },
  glassesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  glassLens: {
    width: 20,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#666',
    backgroundColor: 'rgba(200,220,255,0.3)',
  },
  glassBridge: {
    width: 6,
    height: 2,
    backgroundColor: '#666',
  },
  smile: {
    width: 20,
    height: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: '#A0522D',
    marginTop: 6,
  },
  body: {
    width: 70,
    height: 90,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    marginTop: 4,
  },
  armRight: {
    position: 'absolute',
    top: 96,
    right: -20,
    width: 16,
    height: 60,
    backgroundColor: '#F5C5A3',
    borderRadius: 8,
    transform: [{ rotate: '-40deg' }],
  },
  armLeft: {
    position: 'absolute',
    top: 97,
    left:-18,
    width: 16,
    height: 60,
    backgroundColor: '#F5C5A3',
    borderRadius: 8,
    transform: [{ rotate: '40deg' }],
  },
  bottomContent: {
    paddingHorizontal: 32,
    paddingVertical: 32,
    alignItems: 'center',
  },
  subText: {
    fontSize: 18,
    color: '#555570',
    fontWeight: '400',
    marginBottom: 2,
  },
  boldText: {
    fontSize: 20,
    color: '#1A1A2E',
    fontWeight: '800',
    marginBottom: 28,
    textAlign: 'center',
  },
  continueBtn: {
    backgroundColor: '#F0E06A',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 60,
    marginBottom: 16,
    shadowColor: '#C8B800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    color: '#5A4A00',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  arrowBtn: {
    padding: 8,
  },
  arrowText: {
    fontSize: 24,
    color: '#1A1A2E',
    fontWeight: '700',
  },
});