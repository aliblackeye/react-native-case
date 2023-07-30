import { View, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export type UserLocation = {
	lat: number;
	lon: number;
	detail: string;
}

interface LocationInputProps {
	yourLocation: string;
	setYourLocation: React.Dispatch<React.SetStateAction<string>>;
}

export default function LocationInput(props: LocationInputProps) {
	const { yourLocation, setYourLocation } = props;
	return (
		<View style={styles.locationInput}>
			<TextInput
				placeholder={"Your Location"}
				placeholderTextColor="#fff"
				style={{
					marginRight: 20,
				}}
				value={yourLocation}
				onChangeText={setYourLocation}
			/>
			<FontAwesome
				name="map-marker"
				size={20}
				color="#fff"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	locationInput: {
		paddingVertical: 16,
		paddingHorizontal: 24,
		borderRadius: 8,
		backgroundColor: "#b3145d",
		marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
});
