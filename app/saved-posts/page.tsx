import SavedPostsClient from "./SavedPostsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bài viết đã lưu | Foxtek Blog",
    description: "Tổng hợp các bài viết bạn đã lưu để đọc sau.",
};

export default function SavedPostsPage() {
    return <SavedPostsClient />;
}
