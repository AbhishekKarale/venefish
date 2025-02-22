"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  AnalyticsProvider,
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
} from "reactfire";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { isBrowser } from "@/lib/utils";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
import { firebaseConfig } from "@/lib/firebase";

const FirebaseProviderSDKs: FC<{ children: ReactNode }> = ({ children }) => {
  const firebase = useFirebaseApp();
  const auth = useMemo(() => getAuth(firebase), [firebase]);
  const firestore = useMemo(() => getFirestore(firebase), [firebase]);
  const storage = useMemo(() => getStorage(firebase), [firebase]);
  const analytics = useMemo<Analytics | null>(() => {
    if (!isBrowser()) return null;
    
    let analyticsInstance: Analytics | null = null;
    isSupported().then(supported => {
      if (supported) {
        analyticsInstance = getAnalytics(firebase);
      }
    }).catch(() => {
      // Analytics not supported or blocked
      console.debug('Analytics not supported or blocked');
    });
    
    return analyticsInstance;
  }, [firebase]);

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        <StorageProvider sdk={storage}>
          {analytics ? (
            <AnalyticsProvider sdk={analytics}>{children}</AnalyticsProvider>
          ) : (
            children
          )}
        </StorageProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
};

export const MyFirebaseProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseProviderSDKs>{children}</FirebaseProviderSDKs>
    </FirebaseAppProvider>
  );
};
