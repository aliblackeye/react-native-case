import { useRef, useState } from "react";
import {
	Button,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Pressable,
	Image,
} from "react-native";

// Context
import { useSupport } from "@/context/SupportContext";

// Expo
import { FontAwesome5 } from "@expo/vector-icons";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { router } from "expo-router";

import S3 from "aws-sdk/clients/s3";

// Env
import { AWS_ACCESS, AWS_BUCKET_NAME, AWS_REGION, AWS_SECRET } from "@env";

export default function Picture() {

	const s3 = new S3({
		region: AWS_REGION,
		credentials: {
			accessKeyId: AWS_ACCESS,
			secretAccessKey: AWS_SECRET,
		},
	});

	// Context
	const { image, setImage } = useSupport() as any;

	// Variables
	const camera = useRef<Camera>(null);

	const [type, setType] = useState(CameraType.back);
	const [permission, requestPermission] = Camera.useCameraPermissions();
	const [picture, setPicture] = useState<any>(null);

	const takePicture = async () => {
		try {
			if (camera.current) {
				const picture = await camera.current.takePictureAsync();
				setPicture(picture.uri);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleOk = async (uri: string) => {
		setImage(uri);

		// Upload to S3
		const params = {
			Bucket: AWS_BUCKET_NAME,
			Key: `${Date.now()}.jpg`,
			Body: uri,
			ContentType: "image/jpeg",
			ACL: "public-read",
		};

		// Upload to S3
		const res = s3
			.upload(params, (err: any, data: any) => {
				if (err) {
					console.log(err);
				} else {
					console.log(data);
				}
			})
			.promise();

		console.log(res);

		setPicture(null);
		router.replace("/");
	};

	const toggleCameraType = () => {
		setType((current) =>
			current === CameraType.back ? CameraType.front : CameraType.back
		);
	};

	if (!permission) {
		// Camera permissions are still loading
		return <View />;
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet
		return (
			<View style={styles.container}>
				<Text style={{ textAlign: "center" }}>
					We need your permission to show the camera
				</Text>
				<Button
					onPress={requestPermission}
					title="grant permission"
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{!picture ? (
				<Camera
					ref={camera}
					style={styles.camera}
					type={type}
					focusable
					flashMode={FlashMode.off}></Camera>
			) : (
				<Image
					source={{ uri: picture }}
					style={styles.image}
				/>
			)}
			<View>
				{!picture ? (
					<View style={styles.bottom}>
						<TouchableOpacity onPress={toggleCameraType}>
							<FontAwesome5
								name="sync"
								size={20}
								color="#fff"
							/>
						</TouchableOpacity>
						<Pressable onPress={takePicture}>
							<FontAwesome5
								name="camera"
								size={20}
								color="#fff"
							/>
						</Pressable>
					</View>
				) : (
					<View style={styles.bottom}>
						<Pressable onPress={() => setPicture(null)}>
							<FontAwesome5
								name="trash"
								size={20}
								color="#fff"
							/>
						</Pressable>
						<Pressable onPress={() => handleOk(picture)}>
							<FontAwesome5
								name="check"
								size={20}
								color="#fff"
							/>
						</Pressable>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
		justifyContent: "center",
		paddingBottom: 15,
	},
	camera: {
		flex: 1,
		borderRadius: 20,
	},
	image: {
		flex: 1,
	},
	bottom: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 30,
		paddingHorizontal: 50,
	},
});
