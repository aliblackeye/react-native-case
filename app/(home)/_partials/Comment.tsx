import { TextInput } from "react-native";

interface CommentProps {
	comment: string;
	setComment: React.Dispatch<React.SetStateAction<string>>;
}

export default function Comment(props: CommentProps) {
	const { comment, setComment } = props;
	return (
		<TextInput
			style={{
				paddingHorizontal: 24,
				borderRadius: 8,
				backgroundColor: "#b3145d",
			}}
			placeholder="Please write comment..."
			placeholderTextColor={"#ddd"}
			multiline={true}
			numberOfLines={6}
			onChangeText={setComment}
			value={comment}
		/>
	);
}
