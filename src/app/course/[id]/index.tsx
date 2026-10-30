import { router, useLocalSearchParams } from 'expo-router';

import { CourseRoute } from '@/compose/CourseRoute';

export default function Course() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <CourseRoute
      courseId={id}
      onBack={() => router.back()}
      onDrill={(nodeId) =>
        router.push({ pathname: '/course/[id]/node/[nodeId]', params: { id, nodeId } })
      }
    />
  );
}
