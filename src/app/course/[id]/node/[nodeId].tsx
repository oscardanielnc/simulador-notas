import { router, useLocalSearchParams } from 'expo-router';

import { CourseRoute } from '@/compose/CourseRoute';

export default function Node() {
  const { id, nodeId } = useLocalSearchParams<{ id: string; nodeId: string }>();
  return (
    <CourseRoute
      key={nodeId}
      courseId={id}
      nodeId={nodeId}
      onBack={() => router.back()}
      onDrill={(next) =>
        router.push({ pathname: '/course/[id]/node/[nodeId]', params: { id, nodeId: next } })
      }
    />
  );
}
