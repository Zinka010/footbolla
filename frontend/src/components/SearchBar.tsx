import {
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import * as React from "react";

interface searchProps {
    typeOnChange: React.ChangeEventHandler<HTMLInputElement>
}

export const SearchBar = ({typeOnChange}: searchProps) => {
  return (
    <>
      <InputGroup borderRadius={5} size="sm">
        <InputLeftElement
          pointerEvents="none"
          children={<Search2Icon color="gray.600" />}
        />
        <Input type="text" placeholder="Search..." border="1px solid #949494" onChange={typeOnChange}/>
      </InputGroup>
    </>
  );
};
