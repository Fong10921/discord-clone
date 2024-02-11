import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { API_URLS } from '@/constants/apiUrls';

interface PrivacyAndSafetySwitchProps {
  title: string;
  description?: string;
  disableSwitch?: boolean;
  className?: string;
  infoLink?: string;
  infoLinkDescription?: string;
  data?: boolean;
  type?: string;
}

interface PrivacySafetyMutationContext {
  previousValue: boolean | undefined;
}

const PrivacyAndSafetySwitch: React.FC<PrivacyAndSafetySwitchProps> = ({
  title,
  description,
  disableSwitch,
  className,
  infoLink,
  infoLinkDescription,
  data,
  type,
}) => {
  const [isActive, setIsActive] = useState<boolean | undefined>(data);
  const queryClient = useQueryClient();
  const rollbackValue = useRef<boolean | undefined>(data);

  const updatePrivacySafetySwitch = async ({
    type,
    value,
  }: {
    type: string | undefined;
    value: boolean | undefined;
  }) => {
    try {
      const response = await axios.patch(API_URLS.PRIVACY_SAFETY, { type, value });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  const updateMutation = useMutation<boolean | undefined, any, { type: string | undefined; value: boolean | undefined }, PrivacySafetyMutationContext>({
    mutationFn: updatePrivacySafetySwitch,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['userPrivacySafety']});
      const previousValue = rollbackValue.current;
      rollbackValue.current = variables.value;
      queryClient.setQueryData(["userPrivacySafety"], variables.value);
      return { previousValue };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["userPrivacySafety"], context?.previousValue);
      rollbackValue.current = context?.previousValue;
      setIsActive(context?.previousValue); 
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userPrivacySafety']});
    },
  });

  const handleToggle = () => {
    const newValue = !isActive;
    setIsActive(newValue);
    updateMutation.mutate({ type, value: newValue }); 
  };

  return (
    <>
      <div className={cn(`flex flex-row justify-between`, className)}>
        <h2 className="font-semibold text-base text-[#dadfe7]">{title}</h2>
        {!disableSwitch && (
          <Switch
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
            checked={isActive}
            onCheckedChange={handleToggle}
          />
        )}
      </div>
      <p className="text-sm font-[550] mt-2 text-[#B5BAC1]">
        {description}{' '}
        <a
          href={infoLink}
          className="text-[#00A8FC] cursor-pointer hover:underline"
        >
          {infoLinkDescription}
        </a>
      </p>
    </>
  );
};

export default PrivacyAndSafetySwitch;
