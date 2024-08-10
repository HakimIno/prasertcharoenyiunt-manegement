import supabase from "./supabase";

export async function getTokens() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        throw new Error('No active session found');
    }
    return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
    };
}