import { Pressable, Text, StyleSheet } from "react-native";

interface IButton {
	text: string;
	icon?: any;
	onPress?: () => void;
	textAlign?: "left" | "center" | "right" | "auto" | "justify" | undefined;
}

const buttonStyles = StyleSheet.create({
	button: {
		color: "#fff",
		flexDirection: "row",
		paddingHorizontal: 24,
		paddingVertical: 16,
		borderRadius: 8,
		marginBottom: 10,
	},
	text: {
		color: "#fff",
		flex: 1,
	},
	icon: {
		color: "#fff",
		flex: 1,
	},
});

export default function Button(props: IButton) {
	// Destructing props
	const { text, icon, onPress, textAlign } = props;

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? "#991450" : "#b3175e",
				},
				buttonStyles.button,
			]}>
			<Text style={{ ...buttonStyles.text, textAlign }}>{text}</Text>
			{icon}
		</Pressable>
	);
}
