import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";

// Expo
import { BarCodeScanner } from "expo-barcode-scanner";
import { router } from "expo-router";

// Context
import { useSupport } from "@/context/SupportContext";

export default function QR() {
	// Context
	const { setQrCode } = useSupport() as any;

	// States
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const [scanned, setScanned] = useState(false);

	const handleBarCodeScanned = ({
		type,
		data,
	}: {
		type: string;
		data: string;
	}) => {
		setScanned(true);

		setQrCode(data); // QR Kodu context'e kaydet
		router.replace("/"); // Anasayfaya yönlendir
	};

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
			<BarCodeScanner
				barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
				style={StyleSheet.absoluteFillObject}
			/>
			{scanned && (
				<Button
					title={"Tap to Scan Again"}
					onPress={() => setScanned(false)}
				/>
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
		borderColor: "#2bac1f",
	},
	topRight: {
		position: "absolute",
		top: 0,
		right: 0,
		width: 50,
		height: 50,
		borderTopWidth: 3,
		borderRightWidth: 3,
		borderColor: "#2bac1f",
	},
	bottomLeft: {
		position: "absolute",
		bottom: 0,
		left: 0,
		width: 50,
		height: 50,
		borderBottomWidth: 3,
		borderLeftWidth: 3,
		borderColor: "#2bac1f",
	},
	bottomRight: {
		position: "absolute",
		bottom: 0,
		right: 0,
		width: 50,
		height: 50,
		borderBottomWidth: 3,
		borderRightWidth: 3,
		borderColor: "#2bac1f",
	},
});
