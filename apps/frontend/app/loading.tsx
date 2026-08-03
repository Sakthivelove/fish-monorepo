// frontend/app/loading.tsx

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
        <p className="text-xl font-semibold text-blue-600">
          மீன் வகைகளைப் பெறுகிறோம்...
        </p>
        <p className="text-gray-500">சிறிது நேரம் காத்திருக்கவும்</p>
      </div>
    </div>
  );
}