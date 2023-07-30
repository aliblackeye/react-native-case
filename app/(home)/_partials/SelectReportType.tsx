import { Text, View, Pressable, StyleProp, ViewStyle } from "react-native";

import { FontAwesome } from "@expo/vector-icons";

export type ReportType = { broken: boolean; parking: boolean; other: boolean };

interface ISelectReportType {
	setType: React.Dispatch<React.SetStateAction<ReportType>>;
	type: ReportType;
}

export default function SelectReportType(props: ISelectReportType) {
	const { setType, type } = props;

	const buttonStyle: StyleProp<ViewStyle> = {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 5,
	};

	const handlePress = (selectedType: ReportType) => {
		setType(selectedType);
	};

	return (
		<View
			style={{
				flex: 2,
				backgroundColor: "#b3145d",
				borderRadius: 10,
				paddingVertical: 16,
				paddingHorizontal: 24,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				marginBottom: 10,
			}}>
			{/* Report Defective Vehicle  */}
			<Pressable
				style={buttonStyle}
				onPress={() => {
					handlePress({
						broken: true,
						parking: false,
						other: false,
					});
				}}>
				<Text
					style={{
						fontSize: 12,
						color: "#fff",
					}}>
					Report Defective Vehicle
				</Text>

				<FontAwesome
					style={{ display: type.broken ? "flex" : "none" }}
					name="check"
					size={16}
					color="#fff"
				/>
			</Pressable>
			{/* Report Wrong Parking */}
			<Pressable
				style={buttonStyle}
				onPress={() => {
					handlePress({
						broken: false,
						parking: true,
						other: false,
					});
				}}>
				<Text
					style={{
						fontSize: 12,
						color: "#fff",
					}}>
					Report Wrong Parking
				</Text>
				<FontAwesome
					style={{ display: type.parking ? "flex" : "none" }}
					name="check"
					size={16}
					color="#fff"
				/>
			</Pressable>
			{/* Report Other */}
			<Pressable
				style={buttonStyle}
				onPress={() => {
					handlePress({
						broken: false,
						parking: false,
						other: true,
					});
				}}>
				<Text style={{ fontSize: 12, color: "#fff" }}>Report Other</Text>
				<FontAwesome
					style={{ display: type.other ? "flex" : "none" }}
					name="check"
					size={16}
					color="#fff"
				/>
			</Pressable>
		</View>
	);
}
