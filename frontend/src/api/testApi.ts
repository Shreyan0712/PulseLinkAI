export const testBackend = async () => {
  try {
    const response = await fetch("http://127.0.0.1:8000/");
    const data = await response.json();
    console.log("✅ Backend Response:", data);
  } catch (error) {
    console.error("❌ Backend Connection Failed:", error);
  }
};
