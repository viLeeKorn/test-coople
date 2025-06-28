import React from 'react';
import { Text } from '@gluestack-ui/themed';

interface DateFormatterProps {
  timestamp: number;
  format: 'date' | 'time' | 'datetime' | 'full';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
  prefix?: string;
}

export default function DateFormatter({ 
  timestamp, 
  format, 
  size = 'sm',
  color,
  prefix 
}: DateFormatterProps) {
  const formatDate = (timestamp: number, formatType: string) => {
    const date = new Date(timestamp);
    
    switch (formatType) {
      case 'date':
        return date.toLocaleDateString('de-CH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      case 'time':
        return date.toLocaleTimeString('de-CH', {
          hour: '2-digit',
          minute: '2-digit',
        });
      case 'datetime':
        return `${date.toLocaleDateString('de-CH', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })} at ${date.toLocaleTimeString('de-CH', {
          hour: '2-digit',
          minute: '2-digit',
        })}`;
      case 'full':
        return date.toLocaleDateString('de-CH', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      default:
        return date.toLocaleDateString('de-CH');
    }
  };

  const fontSizeMap = {
    xs: '$xs',
    sm: '$sm',
    md: '$md',
    lg: '$lg'
  };

  return (
    <Text fontSize={fontSizeMap[size]} color={color}>
      {prefix ? `${prefix} ` : ''}{formatDate(timestamp, format)}
    </Text>
  );
} 