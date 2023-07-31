import { createContext, useContext, useState } from "react";

const Context = createContext({});

const Provider = ({ children }: { children: any }) => {
	const [qrCode, setQrCode] = useState<string>(""); // QR Kodu
	const [image, setImage] = useState<string>(""); // Resim
	const [imageUrl, setImageUrl] = useState<string>(""); // Resim URL

	const data = {
		qrCode,
		setQrCode,
		image,
		setImage,
		setImageUrl
	};

	return <Context.Provider value={data}>{children}</Context.Provider>;
};

export const useSupport = () => useContext(Context);

export default Provider;
