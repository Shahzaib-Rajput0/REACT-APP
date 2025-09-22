import React, { useMemo, useState } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, Pressable, Text, View } from "react-native";
import { EMPLOYEES } from "../data/employee";
import { getSortedRequests, simulateAccess, type Decision } from "../lib/simulate";

import { Platform } from "react-native";
if (Platform.OS === "web") {
  require("./global.css");
}


const TAB_BAR_HEIGHT = 52; 
export default function HomeTab() {
  const insets = useSafeAreaInsets();
  const [results, setResults] = useState<Decision[] | null>(null);
  const requests = useMemo(() => getSortedRequests(EMPLOYEES), []);

  const run = () => setResults(simulateAccess(requests));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0d23" }}>
      {/* Content area (give a *little* extra bottom space for the floating button) */}
      <View style={{ flex: 1, paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 72 }}>
        <View style={{ padding: 16 }}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>Access Simulator</Text>
          <Text style={{ color: "#9aa0b4", marginTop: 4 }}>
            HR tool: run rules on requests and explain each decision.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={{ color: "#c8d0e0", marginBottom: 8 }}>Requests (sorted by time)</Text>
          <FlatList
            horizontal
            data={requests}
            keyExtractor={(_, i) => "req-" + i}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#171a2b",
                  padding: 10,
                  borderRadius: 12,
                  marginRight: 10,
                  borderWidth: 1,
                  borderColor: "#262b44",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>{item.id}</Text>
                <Text style={{ color: "#9aa0b4" }}>
                  {item.room} · lvl {item.access_level} · {item.request_time}
                </Text>
              </View>
            )}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Text style={{ color: "#c8d0e0", marginBottom: 8 }}>Results</Text>
          <FlatList
            data={results ?? []}
            keyExtractor={(_, i) => "res-" + i}
            contentContainerStyle={{ paddingBottom: 12 }}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: item.granted ? "#153a2b" : "#3a1b1b",
                  borderColor: item.granted ? "#2b6b52" : "#6b2b2b",
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {item.granted ? "GRANTED" : "DENIED"} — {item.id} @ {item.time}
                </Text>
                <Text style={{ color: "#dbe5ff", marginTop: 4 }}>Room: {item.room}</Text>
                <Text style={{ color: "#cfd6eb", marginTop: 2 }}>{item.reason}</Text>
              </View>
            )}
            ListEmptyComponent={
              <Text style={{ color: "#8d93a6" }}>
                Tap “Simulate Access” to generate decisions.
              </Text>
            }
          />
        </View>
      </View>

      {/* Floating simulate button — always visible above the tab bar */}
      <Pressable
        onPress={run}
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: insets.bottom + TAB_BAR_HEIGHT + 12,
          backgroundColor: "#41c0f0",
          paddingVertical: 14,
          borderRadius: 12,
          alignItems: "center",
          elevation: 6, // Android shadow
        }}
      >
        <Text style={{ color: "#0b1020", fontWeight: "700" }}>Simulate Access</Text>
      </Pressable>
    </SafeAreaView>
  );
}
