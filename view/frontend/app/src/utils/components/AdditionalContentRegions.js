// @flow
import React from 'react';
import KoBindScope from '$src/utils/components/KoBindScope';

type Props = {
  id: string,
  region: string,
};

export default function AdditionalContent({id, region}: Props) {
  return <KoBindScope scope={region} divProps={{id}} />;
}
