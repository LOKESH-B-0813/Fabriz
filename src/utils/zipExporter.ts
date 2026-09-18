import JSZip from 'jszip';

export interface ProjectFileEntry {
  path: string;
  content: string;
}

export const androidCodebaseFiles: ProjectFileEntry[] = [
  {
    path: 'README.md',
    content: `# Fabriz — Keeps You Awake

"Fabriz doesn't just remember what you have to do. It remembers what you keep avoiding."

A minimalist, native Android task-management application built with Kotlin and Jetpack Compose.
Open this project directly in Android Studio or build via ./gradlew assembleDebug.
`
  },
  {
    path: 'firestore.rules',
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /tasks/{taskId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;

        match /history/{eventId} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }
    match /{document=**} {
      allow read, write: false;
    }
  }
}`
  },
  {
    path: 'settings.gradle.kts',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "Fabriz"
include(":app")`
  },
  {
    path: 'build.gradle.kts',
    content: `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.google.services) apply false
}`
  },
  {
    path: 'gradle.properties',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.7-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`
  },
  {
    path: 'gradle/libs.versions.toml',
    content: `[versions]
agp = "8.5.2"
kotlin = "2.0.0"
coreKtx = "1.13.1"
junit = "4.13.2"
lifecycleRuntimeKtx = "2.8.4"
activityCompose = "1.9.1"
composeBom = "2024.08.00"
navigationCompose = "2.8.0"
material3 = "1.2.1"
firebaseBom = "33.2.0"
googleServices = "4.4.2"
coroutines = "1.8.1"
workManager = "2.9.1"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3", version.ref = "material3" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-work-runtime-ktx = { group = "androidx.work", name = "work-runtime-ktx", version.ref = "workManager" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
firebase-bom = { group = "com.google.firebase", name = "firebase-bom", version.ref = "firebaseBom" }
firebase-auth-ktx = { group = "com.google.firebase", name = "firebase-auth-ktx" }
firebase-firestore-ktx = { group = "com.google.firebase", name = "firebase-firestore-ktx" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
google-services = { id = "com.google.gms.google-services", version.ref = "googleServices" }`
  },
  {
    path: 'app/build.gradle.kts',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.services)
}

android {
    namespace = "com.fabriz.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.fabriz.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.work.runtime.ktx)
    implementation(libs.kotlinx.coroutines.android)
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth.ktx)
    implementation(libs.firebase.firestore.ktx)
    testImplementation(libs.junit)
}`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".FabrizApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Fabriz">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    path: 'app/src/main/java/com/fabriz/app/FabrizApplication.kt',
    content: `package com.fabriz.app
import android.app.Application
import com.fabriz.app.firebase.FirebaseManager
import com.fabriz.app.notifications.NotificationHelper

class FabrizApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseManager.getInstance(this)
        NotificationHelper(this)
    }
}`
  },
  {
    path: 'app/src/main/java/com/fabriz/app/MainActivity.kt',
    content: `package com.fabriz.app
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.navigation.compose.rememberNavController
import com.fabriz.app.ui.navigation.FabrizNavGraph
import com.fabriz.app.ui.theme.FabrizTheme
import com.fabriz.app.viewmodel.TaskViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: TaskViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            FabrizTheme {
                val navController = rememberNavController()
                FabrizNavGraph(
                    navController = navController,
                    viewModel = viewModel,
                    hasSeenOnboarding = true,
                    onCompleteOnboarding = {}
                )
            }
        }
    }
}`
  },
  {
    path: 'app/src/main/java/com/fabriz/app/model/Task.kt',
    content: `package com.fabriz.app.model
import java.util.UUID

data class Task(
    val id: String = UUID.randomUUID().toString(),
    val userId: String = "",
    val title: String = "",
    val description: String = "",
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis(),
    val dueAt: Long? = null,
    val completedAt: Long? = null,
    val reminderAt: Long? = null,
    val priority: Priority = Priority.NONE,
    val recurrence: Recurrence = Recurrence.NONE,
    val completed: Boolean = false,
    val archived: Boolean = false,
    val postponedCount: Int = 0,
    val totalPostponementDuration: Long = 0L,
    val lastPostponedAt: Long? = null,
    val lastCompletedAt: Long? = null,
    val attemptCount: Int = 0,
    val lastOpenedAt: Long? = null,
    val history: List<TaskEvent> = emptyList()
) {
    fun isOverdue(now: Long = System.currentTimeMillis()) = !completed && !archived && dueAt != null && dueAt < now
    fun isPostponedRepeatedly() = postponedCount >= 3
    fun totalDelayDays() = if (totalPostponementDuration > 0) totalPostponementDuration / (1000L * 60 * 60 * 24) else 0L
    fun ageInDays(now: Long = System.currentTimeMillis()) = (now - createdAt).coerceAtLeast(0) / (1000L * 60 * 60 * 24)
}`
  },
  {
    path: 'app/src/main/java/com/fabriz/app/model/TaskEvent.kt',
    content: `package com.fabriz.app.model
import java.util.UUID

enum class TaskEventType { CREATED, OPENED, POSTPONED, COMPLETED, REOPENED, RESCHEDULED, ARCHIVED }

data class TaskEvent(
    val id: String = UUID.randomUUID().toString(),
    val type: TaskEventType = TaskEventType.CREATED,
    val timestamp: Long = System.currentTimeMillis(),
    val note: String? = null,
    val previousDueAt: Long? = null,
    val newDueAt: Long? = null
)`
  },
  {
    path: 'app/src/main/java/com/fabriz/app/data/TaskRepository.kt',
    content: `package com.fabriz.app.data
import android.content.Context
import com.fabriz.app.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class TaskRepository private constructor(context: Context) {
    private val _tasks = MutableStateFlow<List<Task>>(emptyList())
    val tasks = _tasks.asStateFlow()

    suspend fun postponeTask(taskId: String, newDueAt: Long, note: String?) {
        val task = _tasks.value.find { it.id == taskId } ?: return
        val delay = (newDueAt - (task.dueAt ?: System.currentTimeMillis())).coerceAtLeast(0)
        val updated = task.copy(
            dueAt = newDueAt,
            postponedCount = task.postponedCount + 1,
            totalPostponementDuration = task.totalPostponementDuration + delay,
            lastPostponedAt = System.currentTimeMillis(),
            history = task.history + TaskEvent(type = TaskEventType.POSTPONED, timestamp = System.currentTimeMillis(), note = note)
        )
        _tasks.value = _tasks.value.map { if (it.id == taskId) updated else it }
    }

    companion object {
        fun getInstance(context: Context) = TaskRepository(context)
    }
}`
  },
  {
    path: 'app/src/test/java/com/fabriz/app/TaskMemoryLogicTest.kt',
    content: `package com.fabriz.app
import com.fabriz.app.model.*
import org.junit.Assert.*
import org.junit.Test

class TaskMemoryLogicTest {
    @Test
    fun testTaskAvoidanceMemory() {
        val now = System.currentTimeMillis()
        var task = Task(title = "Learn Linux", dueAt = now, createdAt = now)
        task = task.copy(
            postponedCount = 4,
            totalPostponementDuration = 8 * 24 * 3600 * 1000L
        )
        assertEquals(4, task.postponedCount)
        assertEquals(8L, task.totalDelayDays())
        assertTrue(task.isPostponedRepeatedly())
    }
}`
  }
];

export async function downloadAndroidProjectZip() {
  const zip = new JSZip();

  androidCodebaseFiles.forEach((file) => {
    zip.file(file.path, file.content);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Fabriz-Android-Native-Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
