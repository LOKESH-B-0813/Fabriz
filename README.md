# FABRIZ — Keeps You Awake

> *"Fabriz doesn't just remember what you have to do. It remembers what you keep avoiding."*

---

## 1. What Fabriz Is

**Fabriz** is a minimalist, native Android application engineered with Kotlin and Jetpack Compose. It bridges three core personal pillars into a single, cohesive, private tool:

1. **Personal Productivity & Avoidance Memory**: Tracks the complete lifecycle of your tasks, recording when a task was born, how many times you postponed it, how much delay accumulated, and actionable insights into avoidance patterns.
2. **Personal Knowledge Shelf**: Fast, frameless notes supporting long-form writing, tag organization, search, archive, and image attachments via the Android Photo Picker.
3. **Client-Side Password Manager**: A strict, zero-knowledge credential manager for up to 15 essential passwords, encrypted client-side with AES-256-GCM using keys derived from your master password.

Fabriz is **NOT** a bloated clone of Notion, Evernote, Google Keep, Todoist, or a full-blown commercial password manager. It is intentionally restrained, distraction-free, and respectful of your cognitive bandwidth.

---

## 2. Core Pillars & Architecture

### I. The Avoidance & Task Memory Engine
- **Pristine Today View**: Displays only what demands your focus today, formatted with time-based greetings, exact alarm time badges, and the signature `↻ Postponed X times` indicator.
- **Micro-Event Timeline**: Every task records its history: `CREATED`, `SCHEDULED`, `POSTPONED`, `OPENED`, `COMPLETED`, `REOPENED`.
- **Compassionate Postponement**: Rescheduling keeps user dignity intact while maintaining honest memory. When avoidance patterns emerge (3+ postponements), Fabriz offers constructive guidance: *"Consider breaking this into a smaller step first."*
- **Actionable Insights**: Accessible directly from Today via the top-bar spark icon. Displays completion rates, postponement counts, and time-of-day behavioral patterns.

### II. Personal Knowledge (Notes)
- **Fast Long-Form Editor**: Frameless title and body inputs designed for comfortable typing.
- **Search & Filter**: Search across titles, markdown content, and `#tags`.
- **Photo Attachments**: Seamless integration with the modern Android Photo Picker (`ActivityResultContracts.PickMultipleVisualMedia`)—zero broad storage or camera permissions required!
- **Archive System**: Clear your active view without losing historical thoughts.
- **Private Supabase Storage**: Image attachments use isolated, user-scoped storage paths (`users/{uid}/notes/{noteId}/...`). Firebase Storage is not used.

### III. Secure Password Manager (Max 15 Passwords)
- **Zero-Knowledge Encryption**: Passwords are encrypted on-device with AES-256 in GCM mode (`AES/GCM/NoPadding`) with a unique 12-byte initialization vector (IV) generated per encryption.
- **Hard Capacity Limit**: Enforces a strict maximum of **15 entries**. The UI displays `X / 15 entries` and prevents clutter.
- **Master Password Derivation**: Master keys are derived using PBKDF2 with HMAC-SHA256 and user-specific salts. Plaintext secrets are never logged, never saved to disk in unencrypted form, and purged from memory upon locking.
- **Quick Actions**: One-tap copy to clipboard, show/hide toggle, and safe browser launching.
- **Auto-Lock Security**: Automatically locks Password Manager and purges active cryptographic keys when navigating away or minimizing the app (`onStop()`).

### IV. Bulletproof Local Notifications
- **Exact Alarms**: Uses `AlarmManager.setExactAndAllowWhileIdle()` via `ExactAlarmScheduler` to ensure reminder notifications fire precisely on schedule, even when the device enters low-power Doze mode.
- **Reboot Resilience**: Local reminders survive reboots with `RECEIVE_BOOT_COMPLETED` and proper fallback workers.

---

## 3. Technology Stack

- **Platform**: Native Android
- **Language**: Kotlin 2.0+
- **UI Toolkit**: Jetpack Compose with Material 3 (`androidx.compose.material3`)
- **Architecture**: Clean MVVM (UI -> ViewModel -> Repository -> Firestore/Crypto)
- **Cryptographic Security**: Android Keystore + JCE (AES-256-GCM, PBKDF2WithHmacSHA256)
- **Asynchronous Flow**: Kotlin Coroutines & `StateFlow`
- **Navigation**: Jetpack Navigation Compose (`NavHost`, `BottomNavigation`)
- **Backend & Cloud Sync**:
  - Firebase Authentication (Email/Password with unique usernames)
  - Cloud Firestore (Offline-first persistence for Tasks, Task Memory, Notes metadata, Password Manager metadata)
  - Supabase Storage (Private, user-isolated storage for Note images only)
- **Alarms & Workers**: Android `AlarmManager` + Jetpack `WorkManager`

---

## 4. Supabase Storage Architecture (Note Images Only)

In accordance with strict architectural boundaries, **Supabase is used exclusively for private note image storage**:
- **Bucket**: `note-images` (Strictly **Private**; public URLs are forbidden)
- **Path Schema**: `users/{firebaseUid}/notes/{noteId}/{imageId}.{extension}`
- **Authentication**: Authenticated requests use the Firebase Auth user's JWT bearer token (`Authorization: Bearer <firebaseIdToken>`).
- **File Validation**:
  - Max file size: **5 MB**
  - Allowed MIME types: **JPEG**, **PNG**, **WebP**
- **Offline Resilience**: Offline actions fail gracefully with clear UI feedback (`"Image upload requires an internet connection."`) while entered note text is fully preserved in Firestore.

### Supabase Setup & Local Properties
Configuration is specified in `android/local.properties`:
```properties
SUPABASE_URL=https://kteidruvagfxigyzhifz.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_yZiEKQq_5xJZL7pZXRNaOQ_MMnRpns2
```

### Deploying Supabase Storage RLS Policies
Execute the SQL statements provided in `supabase_storage_policies.sql` inside the Supabase SQL Editor:
- Automatically creates the private `note-images` bucket with 5 MB and JPEG/PNG/WebP constraints.
- Enforces user isolation based on `auth.jwt() ->> 'sub'` matching the path segment `users/{firebaseUid}/...`.
- Disallows unauthorized reads, uploads, updates, or deletions across user boundaries.

---

## 4. Main Navigation (4 Primary Destinations)

The bottom navigation bar features exactly four primary destinations:
1. **Today**: Immediate daily priorities and time-based tasks.
2. **Tasks**: Comprehensive task organizer with filters (Today, Upcoming, Overdue, Avoided, Completed).
3. **Notes**: Personal knowledge shelf with tag filters and photo picker attachments.
4. **Password Manager**: Secure 15-entry password repository.

*Note: Insights is deliberately placed as a sleek action button on the Today screen header to preserve bottom-bar minimalism.*

---

## 5. Firebase Setup Guide

### 1. Register App in Firebase Console
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a project named `Fabriz`.
3. Add an Android app with:
   - **Android package name**: `com.fabriz.app`
   - **App nickname**: `Fabriz`
4. Download your `google-services.json` file.
5. Place the file into `android/app/`:
   ```bash
   cp ~/Downloads/google-services.json android/app/google-services.json
   ```

### 2. Enable Authentication
1. Navigate to **Build > Authentication > Sign-in method**.
2. Enable **Email/Password**.
3. Save changes.

### 3. Deploy Firestore Rules
Fabriz includes complete, production-grade security rules in `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /usernames/{username} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        match /history/{eventId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
      match /notes/{noteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      match /vault/{entryId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /{document=**} {
      allow read, write: false;
    }
  }
}
```

### 4. Configure private Supabase Storage
Firebase Storage is intentionally not used. Create the private `note-images` bucket and execute
`supabase_storage_policies.sql` in Supabase only after configuring Firebase third-party JWT
verification. See the manual configuration notes below; this repository cannot verify dashboard state.

---

## 6. How to Build & Run

### Prerequisites
- JDK 17 or higher (`java -version`)
- Android SDK (API 34)

### Building via Android Studio
1. Open **Android Studio**.
2. Select **File > Open** and choose the `android/` directory.
3. Wait for Gradle sync to finish.
4. Select an emulator or connected USB device.
5. Click **Run (▶)** (`Shift + F10`).

### Building APK from Command Line
```bash
cd android
chmod +x gradlew
./gradlew assembleDebug
```
The output APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Installing on a Physical Android Phone
1. Enable **Developer Options** and **USB Debugging** on your Android device.
2. Connect your phone via USB.
3. Install directly using ADB:
   ```bash
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```

---

## 7. Privacy & Permissions

Fabriz respects user privacy:
- **No Contact Access**: Never asks for address book.
- **No Location Tracking**: Never asks for GPS or fine/coarse location.
- **No Microphone or Camera**: Uses Android Photo Picker for privacy-preserving file selection.
- **No Third-Party Ad Trackers**: Zero telemetry or behavioral tracking SDKs.

---

## 8. Directory Structure

```
android/
├── build.gradle.kts                      # Root build configuration
├── settings.gradle.kts                   # Project repositories & module declarations
├── gradle/libs.versions.toml             # Version catalog (Compose, Firebase, WorkManager)
└── app/
    ├── build.gradle.kts                  # App module with dependencies
    └── src/
        ├── test/java/com/fabriz/app/     # Unit tests
        │   ├── TaskMemoryLogicTest.kt    # Task postponement & memory logic tests
        │   ├── VaultSecurityTest.kt      # AES-GCM encryption & limit tests
        │   └── NoteLogicTest.kt          # Note preview & archive tests
        └── main/
            ├── AndroidManifest.xml       # Permissions, Receiver, and Activity
            └── java/com/fabriz/app/
                ├── FabrizApplication.kt  # Notification channels & Firebase init
                ├── MainActivity.kt       # Edge-to-edge Compose entry & auto-lock
                ├── model/                # Task, TaskEvent, Note, VaultEntry, UserProfile
                ├── data/                 # AuthRepository, NoteRepository, VaultRepository
                ├── security/             # VaultCryptoManager (AES-256-GCM)
                ├── notifications/        # ExactAlarmScheduler, TaskAlarmReceiver
                ├── firebase/             # FirebaseManager (Auth, Firestore, Storage)
                ├── viewmodel/            # AuthViewModel, NoteViewModel, VaultViewModel
                └── ui/
                    ├── navigation/       # FabrizNavGraph (4 primary destinations)
                    ├── theme/            # Material 3 Theme (FabrizGold accents)
                    ├── components/       # Reusable Compose cards, dialogs, sheets
                    └── screens/          # Today, Tasks, Notes, Password Manager, Settings, Insights
```
