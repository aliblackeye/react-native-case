// React
import { useEffect, useState, useCallback } from "react";

// React Native
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Context
import { useSupport } from "@/context/SupportContext";

// Axios
import axios from "axios";

// Expo
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";

// Partials
import OpenCamera from "./_partials/OpenCamera";
import Comment from "./_partials/Comment";
import LocationInput, { UserLocation } from "./_partials/LocationInput";
import SelectReportType, { ReportType } from "./_partials/SelectReportType";

// Components
import Button from "@/components/Button";

export default function HomeScreen() {
	// Context
	const { qrCode, image } = useSupport() as any;

	// States
	const [location, setLocation] = useState<any>(null);
	const [yourLocation, setYourLocation] = useState<string>("");
	const [reverseGeocodeLocation, setReverseGeocodeLocation] =
		useState<any>(null);
	const [comment, setComment] = useState<string>("");

	/* Report Type */
	const [type, setType] = useState<ReportType>({
		broken: false,
		parking: false,
		other: false,
	});

	const [userLocation, setUserLocation] = useState<UserLocation>({
		lat: 0,
		lon: 0,
		detail: "",
	});

	// Functions

	// Koordinatları yer isimlerine çevirir
	const reverseGeocode = async (locationInfo: any) => {
		const reversedLocation = await Location.reverseGeocodeAsync({
			latitude: locationInfo?.coords.latitude, // Enlem
			longitude: locationInfo?.coords.longitude, // Boylam
		});
		setReverseGeocodeLocation(reversedLocation);

		setYourLocation(
			(reversedLocation?.[0]?.city ? reversedLocation?.[0]?.city + ", " : "") +
				(reversedLocation?.[0]?.district
					? reversedLocation?.[0]?.district + ", "
					: "") +
				(reversedLocation?.[0]?.street
					? reversedLocation?.[0]?.street + ", "
					: "") +
				(reversedLocation?.[0]?.name ? reversedLocation?.[0]?.name : "") +
				(reversedLocation?.[0]?.country
					? ", " + reversedLocation?.[0]?.country
					: "")
		);
	};

	const validateFields = () => {
		if (yourLocation === "") return alert("Please enter your location");

		if (qrCode === "") return alert("Please scan a QR Code");

		if (image === "") return alert("Please take a photo");

		if (!type.broken && !type.parking && !type.other)
			return alert("Please select a type");

		if (comment === "") return alert("Please enter a comment");

		return true;
	};

	const handleSend = async () => {
		if (!validateFields()) return;

		try {
			const { data } = await axios.post(
				"https://api.hergele.co/testreport",
				{
					phone: "5555555555",
					qrCode,
					userLocation,
					photo: image,
					type,
				},
				{
					headers: {
						phone: "5555555555",
						authCode: "testCode",
					},
				}
			);
			console.log(data);
		} catch (error) {
			console.log("Error:", error);
		}
	};

	// Use Effects
	useEffect(() => {
		// Konum izni istenir ve konum alınır
		const getLocation = async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.log("Permission to access location was denied");
				return;
			}

			// Konum alınır (Koordinatlar)
			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);

			// Koordinatlar yer isimlerine çevrilir
			await reverseGeocode(location);
		};

		getLocation();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<View
				style={{
					flexDirection: "column",
					height: "100%",
					justifyContent: "space-between",
				}}>
				<View style={styles.body}>
					{/* LOCATION INPUT */}
					<LocationInput
						yourLocation={yourLocation}
						setYourLocation={setYourLocation}
					/>

					{/* SCAN QR CODE */}
					<Button
						text={qrCode !== "" ? qrCode : "Scan QR Code"}
						icon={
							<FontAwesome
								name="qrcode"
								size={20}
								color="#fff"
							/>
						}
						onPress={() => {
							router.push("/qr");
						}}
					/>

					<View style={styles.row}>
						{/* TAKE PICTURE */}
						<OpenCamera />

						{/* REPORT TYPE  */}
						<SelectReportType
							type={type}
							setType={setType}
						/>
					</View>

					<Comment
						comment={comment}
						setComment={setComment}
					/>
				</View>

				<View style={styles.footer}>
					<Button
						onPress={handleSend}
						text="Send"
						textAlign="center"
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 30,
	},
	row: {
		flexDirection: "row",
		gap: 10,
	},
	body: {
		flexDirection: "column",
	},

	map: {
		height: "100%",
		width: "100%",
	},

	footer: {
		marginBottom: 20,
	},
});
