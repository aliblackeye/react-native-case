import { Pressable, StyleSheet, Image, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

// Expo
import { router } from "expo-router";

// Context
import { useSupport } from "@/context/SupportContext";

export default function OpenCamera() {
	// Context
	const { image } = useSupport() as any;


	return (
		<Pressable
			onPress={() => {
				router.push("/(picture)/picture"); // Anasayfaya yönlendir
			}}
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? "#991450" : "#b3175e",
				},
				styles.wrapper,
			]}>
			<View style={styles.button}>
				{image !== "" ? (
					<Image
						source={{ uri: image }}
						style={{ width: 96, height:100, borderRadius:8, objectFit: "cover" }}
					/>
				) : (
					<FontAwesome
						name="camera"
						size={24}
						color="#fff"
					/>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		color: "#fff",
		width: 96,
		height: 100,
		borderRadius: 8,
		marginBottom: 10,
	},
	button: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
});
