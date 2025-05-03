/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CourseListing from '@/components/CourseListing';
import CourseDetail from '@/components/CourseDetail';

export default function Home() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId');

  return (
    <main className="min-h-screen">
      {courseId ? (
        <CourseDetail />
      ) : (
        <CourseListing />
      )}
    </main>
  );
}
