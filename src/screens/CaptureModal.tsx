import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Box, Text } from '../theme';
import { useCaptureStore } from '../store/captureStore';

type Props = {
  visible: boolean;
  isOnline: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function CaptureModal({ visible, isOnline, onClose, onSaved }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const addCapture = useCaptureStore(s => s.addCapture);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    setSaving(true);
    // small delay for UX feel
    await new Promise(r => setTimeout(r, 300));
    addCapture(title.trim(), notes.trim(), photoUri);
    setSaving(false);
    setTitle('');
    setNotes('');
    setPhotoUri(undefined);
    setTitleError(false);
    onSaved();
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setNotes('');
    setPhotoUri(undefined);
    setTitleError(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Box flex={1} backgroundColor="modalBackground">
          {/* Handle bar */}
          <Box alignItems="center" paddingTop="s" paddingBottom="xxs">
            <Box style={styles.handle} backgroundColor="border" />
          </Box>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            {/* Header */}
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="l">
              <Text variant="h2">New Capture</Text>
              <TouchableOpacity onPress={handleClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                <Text variant="body" color="textSecondary">Cancel</Text>
              </TouchableOpacity>
            </Box>

            {/* Offline banner */}
            {!isOnline ? (
              <Box
                borderRadius="m"
                padding="s"
                marginBottom="m"
                style={styles.offlineBanner}>
                <Text variant="bodyMedium" style={{ color: '#FBBF24' }}>
                  ⚠ You're offline — capture will sync when reconnected
                </Text>
              </Box>
            ) : null}

            {/* Title */}
            <Text variant="label" color="textSecondary" marginBottom="xxs">
              TITLE *
            </Text>
            <TextInput
              style={[styles.input, titleError && styles.inputError]}
              placeholder="Enter a title..."
              placeholderTextColor="#94A3B8"
              value={title}
              onChangeText={v => { setTitle(v); setTitleError(false); }}
              returnKeyType="next"
              maxLength={100}
            />
            {titleError ? (
              <Text variant="caption" style={{ color: '#F87171' }} marginTop="xxs">
                Title is required
              </Text>
            ) : null}

            {/* Notes */}
            <Text variant="label" color="textSecondary" marginTop="m" marginBottom="xxs">
              NOTES
            </Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Add notes..."
              placeholderTextColor="#94A3B8"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />

            {/* Photo */}
            <Text variant="label" color="textSecondary" marginTop="m" marginBottom="xs">
              PHOTO (OPTIONAL)
            </Text>
            {photoUri ? (
              <Box flexDirection="row" alignItems="center" gap="s">
                <Image source={{ uri: photoUri }} style={styles.preview} />
                <TouchableOpacity onPress={() => setPhotoUri(undefined)}>
                  <Text variant="body" style={{ color: '#F87171' }}>Remove</Text>
                </TouchableOpacity>
              </Box>
            ) : (
              <TouchableOpacity onPress={pickPhoto} style={styles.photoButton}>
                <Text variant="bodyMedium" color="textSecondary">
                  📷  Add Photo
                </Text>
              </TouchableOpacity>
            )}

            {/* Save button */}
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}>
              {saving ? (
                <ActivityIndicator color="#0F1923" size="small" />
              ) : (
                <Text variant="button" style={{ color: '#0F1923' }}>
                  Save Capture
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: 'Urbanist-Regular',
    fontSize: 15,
    color: '#0F1923',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#F87171',
  },
  notesInput: {
    height: 110,
    paddingTop: 12,
  },
  offlineBanner: {
    backgroundColor: '#78350F',
  },
  photoButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  preview: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  saveButton: {
    marginTop: 28,
    backgroundColor: '#53EAFD',
    borderRadius: 9999,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
});
