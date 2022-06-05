

import CircularProgress from "@mui/material/CircularProgress";
import React from "react";
import avatarDefault from "../assets/images/avatarDefault.jpg"
import { GetImageStringFromBE, IsImageUrl } from "../singleton/imageHelper";

interface Props {
  file?: File | string,
  width: number,
  height: number,
  
}

export class MyThumb extends React.Component<Props & React.HTMLAttributes<HTMLDivElement>> {
  state = {
    loading: false,
    thumb: undefined,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.file || !(nextProps.file instanceof File) || nextProps.file === this.props.file) { return; }

    this.setState({ loading: true }, () => {
      let reader = new FileReader();

      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };

      reader.readAsDataURL(nextProps.file as File);
    });
  }

  render() {
    const { file } = this.props as any;
    const { width } = this.props as any;
    const { height } = this.props as any;
    if (file instanceof File) {
      const { loading, thumb } = this.state;

      if (loading) { return <CircularProgress color="inherit" />; }

      return <img src={thumb}
        alt={file.name} />;
    }

    if (!file) {
      return <img
        style={{ objectFit: "fill" , width: width, height: height}}
        src={avatarDefault}
        alt={"EmptyImage"} />
        ;
    }

    return <img
    style={{ objectFit: "fill" , width: width, height: height}}

      src={IsImageUrl(file as string) ? GetImageStringFromBE(file) : String(file)}

      alt={String(file)} />;
  }
}