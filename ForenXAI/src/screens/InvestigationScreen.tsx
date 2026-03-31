import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Modal } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography } from '../theme/typography';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Card';
import { SmartHeader } from '../components/SmartHeader';
import { useStore } from '../store/useStore';
import { InvestigationCase } from '../types';

export const InvestigationScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { cases, addCase } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');

  const openCases = cases.filter((c) => c.status === 'open');

  const handleCreateCase = () => {
    if (newCaseTitle.trim()) {
      const newCase: InvestigationCase = {
        id: `CASE${Date.now()}`,
        title: newCaseTitle,
        transactions: [],
        notes: [],
        createdAt: new Date().toISOString(),
        status: 'open',
        assignedTo: 'Current User',
      };
      addCase(newCase);
      setNewCaseTitle('');
      setModalVisible(false);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <SmartHeader title={t('investigation.title')} />

      {/* Top action bar */}
      <View style={[styles.actionBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.caseCount, { color: theme.textSecondary }]}>
          {t('investigation.openCases')}: {openCases.length}
        </Text>
        <Pressable
          style={[styles.createButton, { backgroundColor: theme.text }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.createButtonText, { color: theme.background }]}>
            + {t('investigation.createCase')}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {openCases.map((caseItem) => (
          <Card key={caseItem.id} style={styles.caseCard}>
            <Text style={[styles.caseTitle, { color: theme.text }]}>{caseItem.title}</Text>
            <Text style={[styles.caseInfo, { color: theme.textSecondary }]}>
              {caseItem.transactions.length} {t('investigation.transactions')} • {caseItem.notes.length} {t('investigation.notes')}
            </Text>
            <Text style={[styles.caseDate, { color: theme.textSecondary }]}>
              {t('investigation.created')}: {new Date(caseItem.createdAt).toLocaleDateString()}
            </Text>
          </Card>
        ))}
        {openCases.length === 0 && (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {t('investigation.noCases')}
          </Text>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {t('investigation.createCase')}
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
              value={newCaseTitle}
              onChangeText={setNewCaseTitle}
              placeholder="Case title..."
              placeholderTextColor={theme.textSecondary}
            />
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, { backgroundColor: theme.border }]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalButtonText, { color: theme.text }]}>{t('common.cancel')}</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, { backgroundColor: theme.text }]} onPress={handleCreateCase}>
                <Text style={[styles.modalButtonText, { color: theme.background }]}>{t('common.create')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  caseCount: { ...Typography.caption },
  createButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  createButtonText: { ...Typography.bodyBold, fontSize: 13 },
  content: { padding: 16 },
  caseCard: { marginBottom: 12 },
  caseTitle: { ...Typography.h4, marginBottom: 8 },
  caseInfo: { ...Typography.caption, marginBottom: 4 },
  caseDate: { ...Typography.small },
  emptyText: { ...Typography.body, textAlign: 'center', marginTop: 32 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', padding: 24, borderRadius: 12 },
  modalTitle: { ...Typography.h3, marginBottom: 16 },
  input: { ...Typography.body, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  modalButtonText: { ...Typography.bodyBold },
});
