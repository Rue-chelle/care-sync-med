
export interface StaffInviteData {
  email: string;
  name: string;
  role: string;
  tempPassword: string;
}

export async function sendStaffInviteEmail(data: StaffInviteData): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/functions/v1/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: data.email,
        subject: "Your AloraMed Account Invitation",
        template: "welcome",
        data: {
          name: data.name,
          role: data.role,
          tempPassword: data.tempPassword,
        },
      }),
    });
    if (!res.ok) {
      const error = await res.text();
      return { success: false, error };
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
