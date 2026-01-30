import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList, Image, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://chat-app-vhb2.onrender.com";

const api = {
  login: async (username, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  },
  signup: async (userData) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  },
  logout: async () => {
    await fetch(`${API_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
  },
  getUsers: async () => {
    const res = await fetch(`${API_URL}/api/users`, { credentials: "include" });
    return res.json();
  },
  getMessages: async (userId) => {
    const res = await fetch(`${API_URL}/api/messages/${userId}`, { credentials: "include" });
    return res.json();
  },
  sendMessage: async (receiverId, message) => {
    const res = await fetch(`${API_URL}/api/messages/send/${receiverId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message }),
    });
    return res.json();
  },
  deleteMessage: async (messageId) => {
    await fetch(`${API_URL}/api/messages/delete/${messageId}`, { method: "DELETE", credentials: "include" });
  },
};

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("login");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AsyncStorage.getItem("chat-user");
        if (user) {
          setAuthUser(JSON.parse(user));
          setScreen("home");
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (user) => {
    setAuthUser(user);
    await AsyncStorage.setItem("chat-user", JSON.stringify(user));
    setScreen("home");
  };

  const handleLogout = async () => {
    await api.logout();
    setAuthUser(null);
    await AsyncStorage.removeItem("chat-user");
    setScreen("login");
  };

  if (loading) {
    return <SplashScreen />;
  }

  if (!authUser) {
    if (screen === "signup") {
      return <SignupScreen onLogin={handleLogin} onGoBack={() => setScreen("login")} />;
    }
    return <LoginScreen onLogin={handleLogin} onSignup={() => setScreen("signup")} />;
  }

  if (selectedUser) {
    return <ChatScreen user={selectedUser} currentUser={authUser} onBack={() => setSelectedUser(null)} onDelete={api.deleteMessage} onSend={api.sendMessage} />;
  }

  return <HomeScreen currentUser={authUser} onUserSelect={setSelectedUser} onLogout={handleLogout} />;
}

function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.splashContainer}>
      <StatusBar barStyle="dark-content" />
      <Animated.View style={[styles.splashLogo, { transform: [{ scale: scaleAnim }], opacity: fadeAnim }]}>
        <View style={styles.splashIconBg}>
          <Text style={styles.splashIcon}>💬</Text>
        </View>
        <Animated.Text style={[styles.splashTitle, { opacity: fadeAnim }]}>Chat App</Animated.Text>
        <Animated.Text style={[styles.splashSubtitle, { opacity: fadeAnim }]}>Connect instantly</Animated.Text>
      </Animated.View>
    </View>
  );
}

function LoginScreen({ onLogin, onSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("⚠️", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const user = await api.login(username, password);
      onLogin(user);
    } catch (error) {
      Alert.alert("❌", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.backgroundCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSpacer} />
        
        <View style={styles.logoSection}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoBg}>
              <Text style={styles.logoEmoji}>💬</Text>
            </View>
            <View style={styles.logoGlow} />
          </View>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, focusedInput === "username" && styles.inputLabelActive]}>Username</Text>
            <View style={[styles.inputContainer, focusedInput === "username" && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your username" 
                placeholderTextColor="#a0aec0"
                value={username} 
                onChangeText={setUsername}
                onFocus={() => setFocusedInput("username")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>
          
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, focusedInput === "password" && styles.inputLabelActive]}>Password</Text>
            <View style={[styles.inputContainer, focusedInput === "password" && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Enter your password" 
                placeholderTextColor="#a0aec0"
                value={password} 
                onChangeText={setPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry 
              />
            </View>
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
            <View style={styles.buttonGradient}>
              <Text style={styles.primaryButtonText}>{loading ? "Signing in..." : "Sign In"}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={onSignup} activeOpacity={0.7}>
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </View>
  );
}

function SignupScreen({ onLogin, onGoBack }) {
  const [formData, setFormData] = useState({ fullName: "", username: "", phone: "", password: "", confirmPassword: "", gender: "" });
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSignup = async () => {
    const { fullName, username, phone, password, confirmPassword, gender } = formData;
    if (!fullName || !username || !phone || !password || !confirmPassword || !gender) {
      Alert.alert("⚠️", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("⚠️", "Passwords do not match");
      return;
    }
    if (password.length < 6) {
      Alert.alert("⚠️", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const user = await api.signup(formData);
      onLogin(user);
    } catch (error) {
      Alert.alert("❌", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.backgroundCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSpacer} />
        
        <View style={styles.logoSection}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoBg}>
              <Text style={styles.logoEmoji}>✨</Text>
            </View>
            <View style={styles.logoGlow} />
          </View>
          <Text style={styles.welcomeTitle}>Create Account</Text>
          <Text style={styles.welcomeSubtitle}>Join the conversation</Text>
        </View>

        <View style={styles.formCard}>
          <View style={styles.inputRow}>
            <View style={[styles.inputWrapperHalf, { marginRight: 8 }]}>
              <Text style={[styles.inputLabel, focusedInput === "fullName" && styles.inputLabelActive]}>Full Name</Text>
              <View style={[styles.inputContainer, focusedInput === "fullName" && styles.inputContainerFocused]}>
                <TextInput style={styles.input} placeholder="Full name" placeholderTextColor="#a0aec0" value={formData.fullName} onChangeText={(v) => handleChange("fullName", v)} onFocus={() => setFocusedInput("fullName")} onBlur={() => setFocusedInput(null)} />
              </View>
            </View>
            <View style={styles.inputWrapperHalf}>
              <Text style={[styles.inputLabel, focusedInput === "username" && styles.inputLabelActive]}>Username</Text>
              <View style={[styles.inputContainer, focusedInput === "username" && styles.inputContainerFocused]}>
                <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#a0aec0" value={formData.username} onChangeText={(v) => handleChange("username", v)} onFocus={() => setFocusedInput("username")} onBlur={() => setFocusedInput(null)} />
              </View>
            </View>
          </View>
          
          <View style={styles.inputWrapper}>
            <Text style={[styles.inputLabel, focusedInput === "phone" && styles.inputLabelActive]}>Phone</Text>
            <View style={[styles.inputContainer, focusedInput === "phone" && styles.inputContainerFocused]}>
              <Text style={styles.inputIcon}>📱</Text>
              <TextInput style={styles.input} placeholder="+1234567890" placeholderTextColor="#a0aec0" value={formData.phone} onChangeText={(v) => handleChange("phone", v)} keyboardType="phone-pad" onFocus={() => setFocusedInput("phone")} onBlur={() => setFocusedInput(null)} />
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <View style={[styles.inputWrapperHalf, { marginRight: 8 }]}>
              <Text style={[styles.inputLabel, focusedInput === "password" && styles.inputLabelActive]}>Password</Text>
              <View style={[styles.inputContainer, focusedInput === "password" && styles.inputContainerFocused]}>
                <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#a0aec0" value={formData.password} onChangeText={(v) => handleChange("password", v)} secureTextEntry onFocus={() => setFocusedInput("password")} onBlur={() => setFocusedInput(null)} />
              </View>
            </View>
            <View style={styles.inputWrapperHalf}>
              <Text style={[styles.inputLabel, focusedInput === "confirmPassword" && styles.inputLabelActive]}>Confirm</Text>
              <View style={[styles.inputContainer, focusedInput === "confirmPassword" && styles.inputContainerFocused]}>
                <TextInput style={styles.input} placeholder="Confirm" placeholderTextColor="#a0aec0" value={formData.confirmPassword} onChangeText={(v) => handleChange("confirmPassword", v)} secureTextEntry onFocus={() => setFocusedInput("confirmPassword")} onBlur={() => setFocusedInput(null)} />
              </View>
            </View>
          </View>
          
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity 
              style={[styles.genderButton, formData.gender === "male" && styles.genderButtonActive]} 
              onPress={() => handleChange("gender", "male")}
              activeOpacity={0.8}
            >
              <Text style={styles.genderEmoji}>👨</Text>
              <Text style={[styles.genderText, formData.gender === "male" && styles.genderTextActive]}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderButton, formData.gender === "female" && styles.genderButtonActive]} 
              onPress={() => handleChange("gender", "female")}
              activeOpacity={0.8}
            >
              <Text style={styles.genderEmoji}>👩</Text>
              <Text style={[styles.genderText, formData.gender === "female" && styles.genderTextActive]}>Female</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleSignup} disabled={loading} activeOpacity={0.8}>
            <View style={styles.buttonGradient}>
              <Text style={styles.primaryButtonText}>{loading ? "Creating..." : "Create Account"}</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={onGoBack} activeOpacity={0.7}>
              <Text style={styles.footerLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function HomeScreen({ currentUser, onUserSelect, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.getUsers().then((data) => {
      setUsers(data.filter((u) => u._id !== currentUser._id));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.homeHeader}>
        <View style={styles.homeHeaderTop}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: currentUser.profilePic }} style={styles.currentUserAvatar} />
            <View style={styles.headerText}>
              <Text style={styles.homeHeaderTitle}>Messages</Text>
              <Text style={styles.homeHeaderSubtitle}>{filteredUsers.length} contacts</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <View style={styles.searchIconWrapper}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search conversations..." 
            placeholderTextColor="#a0aec0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <View style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      ) : (
        <FlatList 
          data={filteredUsers}
          keyExtractor={(item) => item._id} 
          renderItem={({ item, index }) => (
            <Animated.View style={[styles.userCard, { opacity: new Animated.Value(1) }]}>
              <Pressable 
                style={({ pressed }) => [styles.userCardPressable, pressed && styles.userCardPressed]}
                onPress={() => onUserSelect(item)}
              >
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: item.profilePic }} style={styles.userAvatar} />
                  <View style={styles.onlineDot} />
                </View>
                <View style={styles.userCardContent}>
                  <View style={styles.userCardHeader}>
                    <Text style={styles.userCardName}>{item.fullName}</Text>
                    <Text style={styles.userCardTime}>now</Text>
                  </View>
                  <Text style={styles.userCardUsername}>@{item.username}</Text>
                  <Text style={styles.userCardPreview} numberOfLines={1}>Tap to start chatting</Text>
                </View>
                <View style={styles.userCardArrow}>
                  <Text style={styles.arrowIcon}>›</Text>
                </View>
              </Pressable>
            </Animated.View>
          )} 
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            filteredUsers.length > 0 ? (
              <Text style={styles.sectionHeader}>Recent</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrapper}>
                <Text style={styles.emptyEmoji}>👥</Text>
              </View>
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptySubtitle}>Start a new conversation to begin chatting</Text>
            </View>
          } 
        />
      )}
    </SafeAreaView>
  );
}

function ChatScreen({ user, currentUser, onBack, onDelete, onSend }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    api.getMessages(user._id).then(setMessages);
  }, [user._id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const tempMsg = { 
      _id: Date.now().toString(), 
      senderId: currentUser._id, 
      message: newMessage.trim(), 
      createdAt: new Date().toISOString() 
    };
    setMessages((prev) => [...prev, tempMsg]);
    setNewMessage("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    try {
      await onSend(user._id, tempMsg.message);
    } catch {
      setMessages((prev) => prev.filter((m) => m._id !== tempMsg._id));
    }
  };

  const handleDelete = async (msgId) => {
    Alert.alert("🗑️", "Delete this message?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        setMessages((prev) => prev.filter((m) => m._id !== msgId));
        try { await onDelete(msgId); } catch {}
      }},
    ]);
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.chatHeaderLeft} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.chatHeaderAvatarWrapper}>
          <Image source={{ uri: user.profilePic }} style={styles.chatHeaderAvatar} />
          <View style={styles.chatOnlineDot} />
        </View>
        <View style={styles.chatHeaderInfo}>
          <Text style={styles.chatHeaderName}>{user.fullName}</Text>
          <Text style={styles.chatHeaderUsername}>@{user.username}</Text>
        </View>
        <TouchableOpacity style={styles.chatMoreButton} activeOpacity={0.7}>
          <Text style={styles.chatMoreIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chatBackground}>
        <View style={styles.chatPattern} />
      </View>

      <FlatList 
        ref={flatListRef}
        data={messages} 
        keyExtractor={(item) => item._id} 
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const fromMe = item.senderId === currentUser._id;
          return (
            <View style={styles.messageRow}>
              <TouchableOpacity 
                style={[styles.messageBubble, fromMe ? styles.messageBubbleSent : styles.messageBubbleReceived]} 
                onLongPress={() => fromMe && handleDelete(item._id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.messageText, fromMe && styles.messageTextSent]}>{item.message}</Text>
                <View style={styles.messageMeta}>
                  <Text style={[styles.messageTime, fromMe && styles.messageTimeSent]}>{formatTime(item.createdAt)}</Text>
                  {fromMe && <Text style={styles.messageCheck}>✓✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          );
        }} 
        contentContainerStyle={styles.chatMessages}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.chatEmpty}>
            <View style={styles.chatEmptyIcon}>
              <Text style={styles.chatEmptyEmoji}>💬</Text>
            </View>
            <Text style={styles.chatEmptyText}>No messages yet</Text>
            <Text style={styles.chatEmptySubtext}>Start the conversation!</Text>
          </View>
        } 
      />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <View style={styles.chatInputContainer}>
          <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
            <Text style={styles.attachIcon}>+</Text>
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.chatInput} 
              placeholder="Type a message..." 
              placeholderTextColor="#a0aec0"
              value={newMessage} 
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
            />
          </View>
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!newMessage.trim()}
            activeOpacity={0.8}
          >
            <Text style={[styles.sendButtonText, !newMessage.trim() && styles.sendButtonTextDisabled]}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Common
  container: { flex: 1, backgroundColor: "#f8fafc" },
  
  // Splash
  splashContainer: { flex: 1, backgroundColor: "#667eea", justifyContent: "center", alignItems: "center" },
  splashLogo: { alignItems: "center" },
  splashIconBg: { width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center", marginBottom: 24 },
  splashIcon: { fontSize: 50 },
  splashTitle: { fontSize: 36, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  splashSubtitle: { fontSize: 18, color: "rgba(255,255,255,0.8)" },
  
  // Background Circles
  backgroundCircles: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" },
  circle: { position: "absolute", borderRadius: 200 },
  circle1: { width: 400, height: 400, top: -150, right: -100, backgroundColor: "rgba(102, 126, 234, 0.1)" },
  circle2: { width: 300, height: 300, bottom: -100, left: -100, backgroundColor: "rgba(118, 75, 162, 0.08)" },
  circle3: { width: 200, height: 200, top: 100, left: -50, backgroundColor: "rgba(102, 126, 234, 0.05)" },
  
  // Scroll
  scrollContent: { flexGrow: 1 },
  headerSpacer: { height: 60 },
  footerSpacer: { height: 40 },
  
  // Logo Section
  logoSection: { alignItems: "center", marginBottom: 32 },
  logoWrapper: { position: "relative", marginBottom: 16 },
  logoBg: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#667eea", justifyContent: "center", alignItems: "center", shadowColor: "#667eea", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
  logoEmoji: { fontSize: 40 },
  logoGlow: { position: "absolute", width: 130, height: 130, borderRadius: 65, backgroundColor: "rgba(102, 126, 234, 0.2)", top: -20, left: -20 },
  welcomeTitle: { fontSize: 32, fontWeight: "bold", color: "#1a202c", marginBottom: 4 },
  welcomeSubtitle: { fontSize: 16, color: "#718096" },
  
  // Form Card
  formCard: { backgroundColor: "#fff", borderRadius: 24, padding: 24, marginHorizontal: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 5 },
  
  // Inputs
  inputWrapper: { marginBottom: 16 },
  inputWrapperHalf: { flex: 1 },
  inputRow: { flexDirection: "row", marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: "600", color: "#718096", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  inputLabelActive: { color: "#667eea" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f7fafc", borderRadius: 14, borderWidth: 2, borderColor: "transparent", paddingHorizontal: 16 },
  inputContainerFocused: { borderColor: "#667eea", backgroundColor: "#fff" },
  inputIcon: { fontSize: 16, marginRight: 12 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: "#1a202c" },
  
  // Gender
  genderRow: { flexDirection: "row", marginBottom: 20 },
  genderButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 14, borderRadius: 14, backgroundColor: "#f7fafc", marginHorizontal: 4, borderWidth: 2, borderColor: "transparent" },
  genderButtonActive: { backgroundColor: "#667eea", borderColor: "#667eea" },
  genderEmoji: { fontSize: 18, marginRight: 8 },
  genderText: { fontSize: 14, fontWeight: "600", color: "#718096" },
  genderTextActive: { color: "#fff" },
  
  // Button
  primaryButton: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
  buttonGradient: { backgroundColor: "#667eea", paddingVertical: 18, alignItems: "center", shadowColor: "#667eea", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  
  // Footer
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  footerText: { fontSize: 14, color: "#718096" },
  footerLink: { fontSize: 14, color: "#667eea", fontWeight: "600" },
  
  // Home Screen
  homeHeader: { backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#f0f5f9" },
  homeHeaderTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  currentUserAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  headerText: { flex: 1 },
  homeHeaderTitle: { fontSize: 26, fontWeight: "bold", color: "#1a202c" },
  homeHeaderSubtitle: { fontSize: 13, color: "#a0aec0", marginTop: 2 },
  logoutButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#f7fafc", justifyContent: "center", alignItems: "center" },
  logoutIcon: { fontSize: 20 },
  
  // Search
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f7fafc", borderRadius: 16, paddingHorizontal: 4, paddingVertical: 4 },
  searchIconWrapper: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#667eea", justifyContent: "center", alignItems: "center" },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 12, fontSize: 15, color: "#1a202c" },
  clearButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#e2e8f0", justifyContent: "center", alignItems: "center", marginRight: 8 },
  clearText: { fontSize: 14, color: "#718096" },
  
  // List
  listContent: { padding: 16 },
  sectionHeader: { fontSize: 13, fontWeight: "600", color: "#a0aec0", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5, paddingLeft: 4 },
  userCard: { backgroundColor: "#fff", borderRadius: 20, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  userCardPressable: { flexDirection: "row", alignItems: "center", padding: 16 },
  userCardPressed: { backgroundColor: "#f7fafc" },
  avatarWrapper: { position: "relative", marginRight: 14 },
  userAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  onlineDot: { position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: "#48bb78", borderWidth: 2, borderColor: "#fff" },
  userCardContent: { flex: 1 },
  userCardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  userCardName: { fontSize: 16, fontWeight: "600", color: "#1a202c" },
  userCardTime: { fontSize: 12, color: "#a0aec0" },
  userCardUsername: { fontSize: 13, color: "#a0aec0", marginTop: 2 },
  userCardPreview: { fontSize: 14, color: "#718096", marginTop: 4 },
  userCardArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#f7fafc", justifyContent: "center", alignItems: "center" },
  arrowIcon: { fontSize: 20, color: "#cbd5e0" },
  
  // Empty State
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyIconWrapper: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#f7fafc", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#1a202c", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: "#a0aec0" },
  
  // Center Content
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 },
  loadingSpinner: { width: 40, height: 40, borderRadius: 20, borderWidth: 3, borderColor: "#f0f0f0", borderTopColor: "#667eea", marginBottom: 16 },
  loadingText: { fontSize: 14, color: "#a0aec0" },
  
  // Chat Screen
  chatHeader: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f5f9" },
  chatHeaderLeft: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  backArrow: { fontSize: 32, color: "#667eea", lineHeight: 32 },
  chatHeaderAvatarWrapper: { position: "relative", marginRight: 12 },
  chatHeaderAvatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  chatOnlineDot: { position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: "#48bb78", borderWidth: 2, borderColor: "#fff" },
  chatHeaderInfo: { flex: 1 },
  chatHeaderName: { fontSize: 17, fontWeight: "600", color: "#1a202c" },
  chatHeaderUsername: { fontSize: 13, color: "#a0aec0" },
  chatMoreButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f7fafc", justifyContent: "center", alignItems: "center" },
  chatMoreIcon: { fontSize: 20, color: "#718096" },
  
  chatBackground: { flex: 1, backgroundColor: "#f8fafc" },
  chatPattern: { flex: 1, backgroundColor: "#f0f5f9", opacity: 0.3 },
  
  chatMessages: { padding: 16, paddingBottom: 8 },
  messageRow: { marginBottom: 8, paddingHorizontal: 4 },
  messageBubble: { maxWidth: "78%", borderRadius: 24, padding: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  messageBubbleSent: { alignSelf: "flex-end", backgroundColor: "#667eea", borderBottomRightRadius: 4 },
  messageBubbleReceived: { alignSelf: "flex-start", backgroundColor: "#fff", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, color: "#1a202c", lineHeight: 22 },
  messageTextSent: { color: "#fff" },
  messageMeta: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 4 },
  messageTime: { fontSize: 11, color: "rgba(160, 174, 192, 0.8)", marginRight: 4 },
  messageTimeSent: { color: "rgba(255, 255, 255, 0.7)" },
  messageCheck: { fontSize: 11, color: "rgba(255, 255, 255, 0.7)" },
  
  chatEmpty: { alignItems: "center", paddingVertical: 60 },
  chatEmptyIcon: { width: 70, height: 70, borderRadius: 35, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  chatEmptyEmoji: { fontSize: 32 },
  chatEmptyText: { fontSize: 17, fontWeight: "600", color: "#1a202c", marginBottom: 4 },
  chatEmptySubtext: { fontSize: 14, color: "#a0aec0" },
  
  chatInputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#f0f5f9" },
  attachButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#f7fafc", justifyContent: "center", alignItems: "center", marginRight: 8 },
  attachIcon: { fontSize: 24, color: "#667eea", lineHeight: 24 },
  inputWrapper: { flex: 1, backgroundColor: "#f7fafc", borderRadius: 21, paddingHorizontal: 16 },
  chatInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: "#1a202c", maxHeight: 100 },
  sendButton: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#667eea", justifyContent: "center", alignItems: "center", marginLeft: 8, shadowColor: "#667eea", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  sendButtonDisabled: { backgroundColor: "#e2e8f0" },
  sendButtonText: { fontSize: 18, color: "#fff", marginLeft: 2 },
  sendButtonTextDisabled: { color: "#a0aec0" },
});
