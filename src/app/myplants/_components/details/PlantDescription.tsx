interface PlantDescriptionProps {
  description?: string;
}

export const PlantDescription = ({ description }: PlantDescriptionProps) => {
  if (!description) return null;

  return (
    <div className="py-4">
      <h2 className="mb-3 text-lg font-semibold text-gray-50">메모</h2>
      <p className="min-h-32 rounded-lg border-gray-50 p-3 text-gray-50 whitespace-pre-wrap">
        {description}
      </p>
    </div>
  );
};