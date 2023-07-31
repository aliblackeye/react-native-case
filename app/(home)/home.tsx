// React
import { useEffect, useState, useCallback } from "react";

// React Native
import { View, StyleSheet, Pressable, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Context
import { useSupport } from "@/context/SupportContext";

// Axios
import axios from "axios";

// S3
import S3 from "aws-sdk/clients/s3";

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
	const s3 = new S3({
		region: "eu-central-1",
		credentials: {
			accessKeyId: "AKIAYUTWBLYX52BYHPUL",
			secretAccessKey: "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",
		},
	});

	// Context
	const { qrCode, image, imageUrl, setImageUrl } = useSupport() as any;

	// States
	const [location, setLocation] = useState<any>(null);
	const [reverseGeocodeLocation, setReverseGeocodeLocation] =
		useState<any>(null);
	const [comment, setComment] = useState<string>("");
	const [success, setSuccess] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

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

		setUserLocation({
			...userLocation,
			detail:
				(reversedLocation?.[0]?.city
					? reversedLocation?.[0]?.city + ", "
					: "") +
				(reversedLocation?.[0]?.district
					? reversedLocation?.[0]?.district + ", "
					: "") +
				(reversedLocation?.[0]?.street
					? reversedLocation?.[0]?.street + ", "
					: "") +
				(reversedLocation?.[0]?.name ? reversedLocation?.[0]?.name : "") +
				(reversedLocation?.[0]?.country
					? ", " + reversedLocation?.[0]?.country
					: ""),
		});
	};

	const validateFields = () => {
		if (userLocation.detail === "") return alert("Please enter your location");

		if (qrCode === "") return alert("Please scan a QR Code");

		if (image === "") return alert("Please take a photo");

		if (!type.broken && !type.parking && !type.other)
			return alert("Please select a type");

		if (comment === "") return alert("Please enter a comment");

		return true;
	};

	function uriToBlob(uri: string): Promise<Blob> {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();

			// If successful -> return with blob
			xhr.onload = function () {
				resolve(xhr.response);
			};

			// reject on error
			xhr.onerror = function () {
				reject(new Error("uriToBlob failed"));
			};

			// Set the response type to 'blob' - this means the server's response
			// will be accessed as a binary object
			xhr.responseType = "blob";

			// Initialize the request. The third argument set to 'true' denotes
			// that the request is asynchronous
			xhr.open("GET", uri, true);

			// Send the request. The 'null' argument means that no body content is given for the request
			xhr.send(null);
		});
	}

	const handleSend = async () => {
		if (!validateFields()) return;

		setLoading(true);
		try {
			// Convert URI to Blob
			const blob = await uriToBlob(image);

			// Set image
			const key = `${Date.now()}.jpg`;
			// Upload to AWS S3
			const params = {
				Bucket: "deneme1awsbucket",
				Key: key,
				Body: blob,
				ContentType: "image/jpeg",
			};

			// Upload to S3
			const res = await s3.upload(params).promise();

			await axios
				.post(
					"https://api.hergele.co/testreport",
					{
						phone: "5555555555",
						qrCode,
						userLocation,
						photo: res.Location,
						type,
						message: comment,
					},
					{
						headers: {
							phone: "5555555555",
							authCode: "testCode",
						},
					}
				)
				.then((res) => {
					setSuccess(true);
					setLoading(false);
				})
				.catch((error) => {
					alert(`Error: ${error}`);
					setLoading(false);
					setSuccess(true);
				});
		} catch (error) {
			console.log("Error:", error);
			setLoading(false);
			setSuccess(false);
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
						userLocation={userLocation}
						setUserLocation={setUserLocation}
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
					<Pressable
						onPress={handleSend}
						disabled={loading || success ? true : false}
						style={({ pressed }) => [
							{
								...styles.sendButton,
								...{
									backgroundColor: success ? "#5cb85c" : "#b3175e",
								},
							},
							pressed && { opacity: 0.5 },
							loading && { opacity: 0.5 },
						]}>
						{success ? (
							<FontAwesome
								name="check"
								size={20}
								color="#fff"
							/>
						) : (
							<Text
								style={{
									color: "#fff",
								}}>
								Send
							</Text>
						)}
					</Pressable>
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
	sendButton: {
		backgroundColor: "#b3175e",
		alignItems: "center",
		justifyContent: "center",
		height: 50,
		borderRadius: 10,
	},
	sendButtonOnPress: {
		backgroundColor: "#4bc914",
		borderColor: "#000",
		borderWidth: 1,
	},
});
