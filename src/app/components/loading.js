import React from "react";
import loaderGif from "@/app/assets/images/gif/loader.gif";
import Image from "next/image";
const Loader = () => {
  return (
    <div style={styles.loaderContainer}>
      <Image
        className="loaderImage justify-content-center mt-10"
        src={loaderGif}
        alt="logo"
        unoptimized={true}
      />
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "top",
  },
  loaderImage: {
    width: "100px",
    height: "100px",
  },
};

export default Loader;
