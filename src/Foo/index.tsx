import React, { use, type FC } from 'react';

const Foo: FC<{ title: string }> = (props) => {
  return <h4>{props.title}</h4>;
};

export default Foo;
