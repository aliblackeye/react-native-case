import { Pressable, Text, StyleSheet, StyleProp } from "react-native";

interface IIconButton {
	icon: any;
	onPress?: () => void;
}

const iconButtonStyles = StyleSheet.create({
	button: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		color: "#fff",
		paddingHorizontal: 24,
		paddingVertical: 40,
		borderRadius: 8,
		marginBottom: 10,
	},

	icon: {
		color: "#fff",
	},
});

export default function IconButton(props: IIconButton) {
	// Destructing props
	const { icon, onPress } = props;

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? "#991450" : "#b3175e",
				},
				iconButtonStyles.button,
			]}>
			{icon}
		</Pressable>
	);
}
