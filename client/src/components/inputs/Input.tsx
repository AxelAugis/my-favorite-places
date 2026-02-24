
interface InputProps {
  dataTestId: string
  label: string
  id: string
  value: string
  placeholder: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

export default function Input({ dataTestId, label, id, value, placeholder, onChange, error }: InputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-2"
      >
        {label}
      </label>
      <input
        data-testid={dataTestId}
        id={id}
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
