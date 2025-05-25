import { DecisionStatus } from '@/api/database/decisions/decision-repository';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { FC } from 'react';

interface InputFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const InputFilter: FC<InputFilterProps> = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-40"
      />
    </div>
  );
};

interface DropdownFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

const DropdownFilter: FC<DropdownFilterProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface DecisionsTableFiltersProps {
  situation: string;
  onSituationChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

const DecisionsTableFilters: FC<DecisionsTableFiltersProps> = ({
  situation,
  onSituationChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}) => {
  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <InputFilter
        label="Situation"
        value={situation}
        onChange={onSituationChange}
        placeholder="Filter by situation..."
      />
      <InputFilter
        label="Category"
        value={category}
        onChange={onCategoryChange}
        placeholder="Filter by category..."
      />
      <DropdownFilter
        label="Status"
        value={status}
        onChange={onStatusChange}
        options={[
          { label: 'Pending', value: DecisionStatus.PENDING },
          { label: 'Completed', value: DecisionStatus.COMPLETED },
          { label: 'Failed', value: DecisionStatus.FAILED },
        ]}
      />
    </div>
  );
};

export { DecisionsTableFilters, DropdownFilter, InputFilter };
