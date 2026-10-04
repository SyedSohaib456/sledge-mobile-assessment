import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'default' | 'success' | 'error' | 'warning';

type ToastMessage = {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastContextValue = {
  show: (title: string, opts?: { description?: string; type?: ToastType }) => void;
  success: (title: string, opts?: { description?: string }) => void;
  error: (title: string, opts?: { description?: string }) => void;
  warning: (title: string, opts?: { description?: string }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TYPE_CONFIG: Record<ToastType, { bg: string; iconBg: string; icon: string; titleColor: string; descColor: string }> = {
  success: { bg: '#065F46', iconBg: '#059669', icon: '\u2713', titleColor: '#ECFDF5', descColor: '#A7F3D0' },
  error:   { bg: '#991B1B', iconBg: '#DC2626', icon: '\u2715', titleColor: '#FEF2F2', descColor: '#FECACA' },
  warning: { bg: '#92400E', iconBg: '#D97706', icon: '!',      titleColor: '#FFFBEB', descColor: '#FDE68A' },
  default: { bg: '#1E293B', iconBg: '#3B82F6', icon: 'i',      titleColor: '#F8FAFC', descColor: '#94A3B8' },
};

function ToastItem({ message, onDone }: { message: ToastMessage; onDone: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, damping: 15, stiffness: 180, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start(onDone);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const cfg = TYPE_CONFIG[message.type];

  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }], backgroundColor: cfg.bg }]}>
      <View style={[styles.iconCircle, { backgroundColor: cfg.iconBg }]}>
        <Text style={styles.iconText}>{cfg.icon}</Text>
      </View>
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: cfg.titleColor }]}>{message.title}</Text>
        {message.description ? (
          <Text style={[styles.desc, { color: cfg.descColor }]}>{message.description}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

let _counter = 0;

function ToastContainer({ toasts, remove }: { toasts: ToastMessage[]; remove: (id: number) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="none">
      {toasts.map(t => (
        <ToastItem key={t.id} message={t} onDone={() => remove(t.id)} />
      ))}
    </View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((title: string, opts?: { description?: string; type?: ToastType }) => {
    const id = ++_counter;
    setToasts(prev => [...prev, { id, title, description: opts?.description, type: opts?.type ?? 'default' }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title: string, opts?: { description?: string }) =>
    show(title, { ...opts, type: 'success' }), [show]);

  const error = useCallback((title: string, opts?: { description?: string }) =>
    show(title, { ...opts, type: 'error' }), [show]);

  const warning = useCallback((title: string, opts?: { description?: string }) =>
    show(title, { ...opts, type: 'warning' }), [show]);

  return (
    <ToastContext.Provider value={{ show, success, error, warning }}>
      {children}
      <ToastContainer toasts={toasts} remove={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    right: 12,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    lineHeight: 22,
  },
  desc: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
});
