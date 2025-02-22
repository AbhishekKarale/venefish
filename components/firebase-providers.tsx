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
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "@/lib/firebase";

const FirebaseProviderSDKs: FC<{ children: ReactNode }> = ({ children }) => {
  const firebase = useFirebaseApp();
  const auth = useMemo(() => getAuth(firebase), [firebase]);
  const firestore = useMemo(() => getFirestore(firebase), [firebase]);
  const storage = useMemo(() => getStorage(firebase), [firebase]);
  const analytics = useMemo(() => isBrowser() && getAnalytics(firebase), [firebase]);

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
