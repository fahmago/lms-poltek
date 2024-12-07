import React from 'react'
import MyLayout from '../../../Layouts/MyLayout'
import { Head, usePage } from '@inertiajs/inertia-react'
import greeting from '../../../Utilities/Greeting'

export default function Index() {
  const { auth } = usePage().props;
  return (
    <MyLayout>
        <Head title="Dashboard" />
        <div className="text-xl font-medium text-gray-800 dark:text-gray-200">
            {greeting(auth.user.name)}
        </div>
    </MyLayout>
  )
}
