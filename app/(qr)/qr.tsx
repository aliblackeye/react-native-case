import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";

// Expo
import { BarCodeScanner } from "expo-barcode-scanner";
import { router } from "expo-router";

// Context
import { useSupport } from "@/context/SupportContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { Camera, FlashMode } from "expo-camera";

export default function QR() {
	// Context
	const { setQrCode } = useSupport() as any;

	// States
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [scanned, setScanned] = useState(false);
	const [qrCodeValue, setQrCodeValue] = useState<string>("");
	const [flash, setFlash] = useState<boolean>(false);

	// Functions
	const handleBarCodeScanned = ({
		type,
		data,
	}: {
		type: string;
		data: string;
	}) => {
		setFlash(false); // Flash'ı kapat
		setScanned(true); // QR Kodu okundu olarak işaretle
		setQrCodeValue(data); // QR Kodu değerini state'e kaydet
	};

	const handleOk = () => {
		setQrCode(qrCodeValue); // QR Kodu context'e kaydet
		router.replace("/"); // Anasayfaya yönlendir
	};

	const handleCancel = () => {
		setScanned(false); // QR Kodu okunmadı olarak işaretle
		setQrCodeValue(""); // QR Kodu değerini sıfırla
	};

	// Effects
	useEffect(() => {
		const getBarCodeScannerPermissions = async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		};

		getBarCodeScannerPermissions();
	}, []);

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>
			<Camera
				barCodeScannerSettings={{
					barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
				}}
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				style={StyleSheet.absoluteFillObject}
				flashMode={flash ? FlashMode.torch : FlashMode.off}
			/>
			{scanned && (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}>
					<Pressable
						onPress={() => {
							handleCancel();
						}}
						style={{
							backgroundColor: "gray",
							padding: 10,
							borderRadius: 10,
						}}>
						<FontAwesome5
							name="sync"
							size={20}
							color="#fff"
						/>
					</Pressable>
					<Pressable
						onPress={() => {
							handleOk();
						}}
						style={{
							backgroundColor: "gray",
							padding: 10,
							borderRadius: 10,
						}}>
						<FontAwesome5
							name="check"
							size={20}
							color="#fff"
						/>
					</Pressable>
				</View>
			)}

			{!scanned && (
				<View style={styles.boxBG}>
					<View style={styles.box}>
						<View style={styles.topLeft}></View>
						<View style={styles.topRight}></View>
						<View style={styles.bottomLeft}></View>
						<View style={styles.bottomRight}></View>
					</View>
				</View>
			)}

			{!scanned && (
				<View style={styles.flashButton}>
					<Pressable
						onPress={() => {
							setFlash(!flash);
						}}
						style={{
							backgroundColor: "gray",
							padding: 10,
							borderRadius: 10,
						}}>
						<FontAwesome5
							name={"lightbulb"}
							size={20}
							color="#fff"
						/>
					</Pressable>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
	},
	boxBG: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	box: {
		width: 200,
		height: 200,
		position: "relative",
	},
	topLeft: {
		position: "absolute",
		top: 0,
		left: 0,
		width: 50,
		height: 50,
		borderTopWidth: 3,
		borderLeftWidth: 3,
		borderColor: "#fff",
	},
	topRight: {
		position: "absolute",
		top: 0,
		right: 0,
		width: 50,
		height: 50,
		borderTopWidth: 3,
		borderRightWidth: 3,
		borderColor: "#fff",
	},
	bottomLeft: {
		position: "absolute",
		bottom: 0,
		left: 0,
		width: 50,
		height: 50,
		borderBottomWidth: 3,
		borderLeftWidth: 3,
		borderColor: "#fff",
	},
	bottomRight: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 50,
		height: 50,
		borderBottomWidth: 3,
		borderRightWidth: 3,
		borderColor: "#fff",
	},
	flashButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
});
