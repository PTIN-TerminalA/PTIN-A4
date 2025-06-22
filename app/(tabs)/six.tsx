import { ThemedText} from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Modal } from "react-native-paper";

export default function Six() {
    return (
        <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText type="title">Six</ThemedText>
        <ThemedText type="default">This is the sixth tab.</ThemedText>
        </ThemedView>
    );
    }