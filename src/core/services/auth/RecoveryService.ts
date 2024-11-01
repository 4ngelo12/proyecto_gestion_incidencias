import { IRecoveryPasswordResponse } from "../../interface/Recovery";
import baseUrl from "../helper";

export const sendMailPassword = async (email: string): Promise<IRecoveryPasswordResponse> => {
    const response = await fetch(`${baseUrl}/correo/recovery/password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const data: IRecoveryPasswordResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}