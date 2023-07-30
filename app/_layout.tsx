import { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SIZES } from "@/constants/themes";

import SupportProvider from "@/context/SupportContext";

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return <RootLayoutNav />;
}

function RootLayoutNav() {
	return (
		<SupportProvider>
			<SafeAreaProvider>
				<Stack>
					<Stack.Screen
						name="index"
						options={{
							headerShown: true,
							headerStyle: { backgroundColor: "#333333" },
							headerTintColor: "#fff",
							contentStyle: { backgroundColor: "#333333" },
							headerTitle: "Support",
							headerTitleStyle: {
								fontSize: SIZES.lg,
							},
							headerLeft: () => (
								<FontAwesome
									name="bars"
									size={18}
									color="white"
									style={{ marginRight: 10 }}
								/>
							),
						}}
					/>
					<Stack.Screen
						name="(qr)/qr"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="(picture)/picture"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
			</SafeAreaProvider>
		</SupportProvider>
	);
}
