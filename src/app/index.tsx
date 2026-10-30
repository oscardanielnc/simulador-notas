import { router } from 'expo-router';

import { HomeScreen } from '@/features/home/HomeScreen';

export default function Home() {
  return <HomeScreen onOpen={(id) => router.push({ pathname: '/course/[id]', params: { id } })} />;
}
