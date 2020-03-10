/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';

const useStyles = makeStyles({
  small: {
    'animation': '$rotation 3s infinite linear',
    'transform-origin': '34.5px 81.5px'
  },
  smallShadow: {
    'animation': '$rotation 3s infinite linear',
    'transform-origin': '37.5px 84.5px'
  },
  narrow: {
    'animation': '$counter-rotation 6s infinite linear',
    'transform-origin': '106.46px 136.83px'
  },
  narrowShadow: {
    'animation': '$counter-rotation 6s infinite linear',
    'transform-origin': '109.46px 139.83px'
  },
  wide: {
    'animation': '$rotation 6s infinite linear',
    'transform-origin': '198.69px 61.69px'
  },
  wideShadow: {
    'animation': '$rotation 6s infinite linear',
    'transform-origin': '201.69px 64.69px'
  },
  spinnerGear: {
    'animation': `$rotation 6s infinite linear`,
    'transform-origin': '50% 50%'
  },
  '@keyframes rotation': {
    from: { 'transform': 'rotate(0deg)' },
    to: { 'transform': 'rotate(360deg)' }
  },
  '@keyframes counter-rotation': {
    from: { transform: 'rotate(360deg)' },
    to: { transform: 'rotate(0deg)' }
  }
});

interface GearsProps {
  fill?: string;
  width?: string | number;
  addElevation?: boolean;
}

interface PathLookup {
  [key: string]: string;
}

interface GearProps {
  type?: 'A' | 'B' | 'C';
  speed?: string;
  fill?: string;
}

export default function Gears(props: GearsProps) {
  const { addElevation = true, width = '100%', fill = '#f00' } = props;
  const classes = useStyles({});
  const opacity = 0.05;
  return (
    <>
      <svg
        width={width}
        fill={fill}
        viewBox="0 0 264 202"
        xmlns="http://www.w3.org/2000/svg">
        {
          addElevation &&
          <>
            <path
              fill="black"
              fillOpacity={opacity}
              fillRule="evenodd"
              clipRule="evenodd"
              className={classes.smallShadow}
              d="M41.7589 50.1955L43.7604 58.4032L43.6815 58.4033C46.4972 59.0679 49.1415 60.1764 51.5363 61.6509L51.5184 61.6331L58.8349 57.2638C60.9878 59.1241 63.0008 61.1191 64.7684 63.2544L60.3799 70.4735L60.3137 70.4073C61.7953 72.8009 62.9107 75.445 63.5819 78.2614L63.5819 78.2433L71.8449 80.3272C72.0518 83.165 72.0646 85.9991 71.8045 88.7589L63.5968 90.7604L63.5967 90.6761C62.9323 93.4944 61.8232 96.141 60.3476 98.5378L60.3668 98.5185L64.7361 105.835C62.8758 107.988 60.8808 110.001 58.7455 111.768L51.5264 107.38L51.5908 107.315C49.1993 108.796 46.5577 109.911 43.744 110.582L43.7568 110.582L41.6729 118.845C38.8351 119.052 36.0011 119.065 33.2412 118.805L31.2397 110.597L31.3152 110.597C28.503 109.933 25.8618 108.826 23.4693 107.355L23.4815 107.367L16.1651 111.736C14.0121 109.876 11.9992 107.881 10.2316 105.745L14.62 98.5264L14.6775 98.5838C13.2011 96.1965 12.0888 93.5603 11.4181 90.7526L11.4181 90.7568L3.15505 88.6729C2.94815 85.8351 2.93542 83.001 3.19547 80.2412L11.4032 78.2397L11.4033 78.3099C12.0673 75.5002 13.1733 72.8613 14.6439 70.4707L14.6331 70.4816L10.2638 63.1651C12.1241 61.0122 14.1191 58.9992 16.2545 57.2316L23.4735 61.6201L23.4144 61.6793C25.8036 60.2016 28.4423 59.0886 31.2527 58.4181L31.2433 58.4181L33.3272 50.1551C36.165 49.9481 38.9991 49.9354 41.7589 50.1955ZM37.4983 97.9066C44.9027 97.9066 50.9049 91.9042 50.9049 84.5C50.9049 77.0958 44.9027 71.0934 37.4983 71.0934C30.094 71.0934 24.0918 77.0958 24.0918 84.5C24.0918 91.9042 30.094 97.9066 37.4983 97.9066Z"
            />
            <path
              className={classes.narrowShadow}
              fillRule="evenodd"
              clipRule="evenodd"
              d="M135.584 92.522L136.853 84.3198C134.405 83.0245 131.784 81.9528 129.085 81.0588L124.099 87.7596C121.376 86.9883 118.564 86.4268 115.683 86.0938L113.716 78.0256C110.959 77.7658 108.127 77.7785 105.292 77.9853L103.247 86.0932C100.366 86.426 97.5548 86.9872 94.8316 87.7583L89.9319 81.0646C87.2852 81.8798 84.6742 82.9751 82.1337 84.251L83.3466 92.5195C80.8402 93.9209 78.4579 95.5177 76.2203 97.2894L69.1213 92.974C66.988 94.7399 64.9948 96.7511 63.1362 98.902L67.4251 106.084C65.6532 108.321 64.0561 110.703 62.6545 113.21L54.4524 111.941C53.1572 114.389 52.0853 117.009 51.1913 119.708L57.8922 124.694C57.1208 127.417 56.5594 130.229 56.2264 133.11L48.1582 135.077C47.8984 137.834 47.9111 140.666 48.1177 143.501L56.2258 145.546C56.5585 148.427 57.1197 151.238 57.8907 153.961L51.197 158.861C52.0123 161.508 53.1075 164.119 54.3836 166.659L62.6519 165.446C64.0533 167.953 65.6502 170.335 67.422 172.573L63.1065 179.672C64.8726 181.805 66.8836 183.798 69.0345 185.657L76.2163 181.368C78.4537 183.14 80.8359 184.737 83.3422 186.139L82.0731 194.341C84.5212 195.636 87.142 196.708 89.8404 197.602L94.8267 190.901C97.5499 191.672 100.361 192.234 103.242 192.567L105.21 200.635C107.967 200.895 110.798 200.882 113.634 200.675L115.678 192.568C118.559 192.235 121.371 191.674 124.094 190.903L128.994 197.596C131.641 196.781 134.252 195.686 136.792 194.41L135.579 186.141C138.086 184.74 140.468 183.143 142.705 181.371L149.805 185.687C151.938 183.921 153.931 181.91 155.79 179.759L151.501 172.577C153.273 170.34 154.87 167.957 156.271 165.451L164.473 166.72C165.769 164.272 166.84 161.651 167.734 158.953L161.034 153.966C161.805 151.243 162.366 148.432 162.699 145.551L170.768 143.584C171.027 140.826 171.015 137.995 170.808 135.16L162.7 133.115C162.367 130.234 161.806 127.422 161.035 124.699L167.729 119.8C166.913 117.153 165.818 114.542 164.542 112.001L156.274 113.214C154.872 110.708 153.276 108.325 151.504 106.088L155.819 98.989C154.053 96.8555 152.042 94.8624 149.891 93.0038L142.71 97.2927C140.472 95.5207 138.09 93.9236 135.584 92.522ZM87.215 172.618C85.5036 175.698 81.0538 176.041 78.3156 174.5C76.433 173.474 71.9833 169.195 67.8758 162.52C64.1107 155.675 62.0569 147.973 62.0569 139.587C62.0569 125.553 68.047 113.06 77.8021 104.332C80.8827 102.62 85.1613 102.963 86.8727 105.872L103.816 134.966C105.185 137.362 105.185 141.983 103.645 144.379L87.215 172.618ZM146.259 169.537C140.783 176.041 133.766 181.175 125.551 184.084C114.94 187.165 101.078 187.336 95.7722 184.427C92.1782 182.715 90.809 178.95 92.5205 175.87L109.292 146.775C110.662 144.379 114.256 142.326 116.994 142.326H149.682C153.276 142.326 155.672 145.406 155.672 148.487C155.672 151.225 153.447 160.638 146.259 169.537ZM150.367 136.335H116.138C113.229 136.164 109.806 133.768 108.437 131.201L92.1782 102.963C90.4667 99.882 92.3493 96.4591 95.0876 94.9188C96.9702 93.8919 102.96 92.0094 110.833 92.0094C133.253 92.5228 151.736 108.781 156.015 130.003C156.528 133.597 153.447 136.335 150.367 136.335ZM111.898 139.33C111.898 140.675 110.808 141.766 109.463 141.766C108.118 141.766 107.028 140.675 107.028 139.33C107.028 137.985 108.118 136.895 109.463 136.895C110.808 136.895 111.898 137.985 111.898 139.33Z"
              fill="black" fillOpacity={opacity}
            />
            <path
              fill="black"
              fillOpacity={opacity}
              fillRule="evenodd"
              clipRule="evenodd"
              className={classes.wideShadow}
              d="M207.934 11.3066L205.956 3.19589C203.19 2.93527 200.35 2.94803 197.506 3.15545L195.451 11.3061C192.566 11.6397 189.751 12.2016 187.024 12.9733L182.099 6.2443C179.444 7.06196 176.825 8.16064 174.277 9.44051L175.496 17.7526C172.986 19.156 170.601 20.755 168.36 22.5286L161.224 18.1905C159.084 19.9619 157.085 21.9792 155.22 24.1369L159.532 31.3564C157.758 33.5969 156.159 35.9821 154.755 38.4915L146.51 37.2157C145.21 39.6713 144.135 42.3001 143.238 45.007L149.975 50.0196C149.203 52.7464 148.64 55.5614 148.307 58.4459L140.196 60.4238C139.935 63.1897 139.948 66.0298 140.155 68.8738L148.306 70.9295C148.64 73.814 149.201 76.629 149.973 79.3558L143.244 84.2814C144.062 86.9365 145.16 89.5556 146.441 92.1036L154.752 90.8844C156.156 93.394 157.755 95.7795 159.529 98.0202L155.19 105.156C156.962 107.297 158.979 109.296 161.137 111.16L168.356 106.849C170.597 108.623 172.982 110.222 175.491 111.625L174.216 119.871C176.671 121.17 179.3 122.245 182.007 123.142L187.02 116.406C189.746 117.178 192.561 117.74 195.446 118.074L197.424 126.185C200.19 126.445 203.03 126.432 205.874 126.225L207.929 118.074C210.814 117.741 213.629 117.179 216.356 116.407L221.282 123.136C223.936 122.319 226.556 121.22 229.104 119.94L227.885 111.628C230.394 110.224 232.779 108.625 235.02 106.852L242.157 111.19C244.296 109.419 246.296 107.401 248.16 105.244L243.849 98.024C245.623 95.7835 247.222 93.3982 248.626 90.8888L256.871 92.1646C258.17 89.709 259.245 87.0802 260.142 84.3733L253.406 79.3607C254.178 76.6339 254.74 73.819 255.074 70.9345L263.184 68.9566C263.445 66.1907 263.432 63.3506 263.225 60.5066L255.074 58.451C254.741 55.5664 254.179 52.7514 253.407 50.0246L260.136 45.099C259.318 42.4439 258.22 39.8248 256.94 37.2768L248.628 38.496C247.224 35.9864 245.625 33.6011 243.852 31.3603L248.19 24.2241C246.418 22.084 244.401 20.0847 242.244 18.2204L235.024 22.5319C232.784 20.7578 230.398 19.1588 227.889 17.755L229.165 9.50957C226.709 8.21026 224.08 7.1352 221.373 6.23846L216.361 12.9746C213.634 12.2025 210.819 11.6404 207.934 11.3066ZM201.69 104.875C223.884 104.875 241.875 86.8834 241.875 64.6902C241.875 42.4969 223.884 24.5057 201.69 24.5057C179.497 24.5057 161.506 42.4969 161.506 64.6902C161.506 86.8834 179.497 104.875 201.69 104.875Z"
            />
          </>
        }
        <path
          className={classes.small}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M38.7589 47.1955L40.7604 55.4032L40.6815 55.4033C43.4972 56.0679 46.1415 57.1764 48.5363 58.6509L48.5184 58.6331L55.8349 54.2638C57.9878 56.1241 60.0008 58.1191 61.7684 60.2544L57.3799 67.4735L57.3137 67.4073C58.7953 69.8009 59.9107 72.445 60.5819 75.2614L60.5819 75.2433L68.8449 77.3272C69.0518 80.165 69.0646 82.9991 68.8045 85.7589L60.5968 87.7604L60.5967 87.6761C59.9323 90.4944 58.8232 93.141 57.3476 95.5378L57.3668 95.5185L61.7361 102.835C59.8758 104.988 57.8808 107.001 55.7455 108.768L48.5264 104.38L48.5908 104.315C46.1993 105.796 43.5577 106.911 40.744 107.582L40.7568 107.582L38.6729 115.845C35.8351 116.052 33.0011 116.065 30.2412 115.805L28.2397 107.597L28.3152 107.597C25.503 106.933 22.8618 105.826 20.4693 104.355L20.4815 104.367L13.1651 108.736C11.0121 106.876 8.99919 104.881 7.23155 102.745L11.62 95.5264L11.6775 95.5838C10.2011 93.1965 9.08881 90.5603 8.41814 87.7526L8.41815 87.7568L0.155054 85.6729C-0.0518517 82.8351 -0.0645774 80.001 0.195466 77.2412L8.40321 75.2397L8.40329 75.3099C9.06727 72.5002 10.1733 69.8613 11.6439 67.4707L11.6331 67.4816L7.26376 60.1651C9.1241 58.0122 11.1191 55.9992 13.2545 54.2316L20.4735 58.6201L20.4144 58.6793C22.8036 57.2016 25.4423 56.0886 28.2527 55.4181L28.2433 55.4181L30.3272 47.1551C33.165 46.9481 35.9991 46.9354 38.7589 47.1955ZM34.4983 94.9066C41.9027 94.9066 47.9049 88.9042 47.9049 81.5C47.9049 74.0958 41.9027 68.0934 34.4983 68.0934C27.094 68.0934 21.0918 74.0958 21.0918 81.5C21.0918 88.9042 27.094 94.9066 34.4983 94.9066Z"
        />
        <path
          className={classes.narrow}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M132.584 89.522L133.853 81.3198C131.405 80.0245 128.784 78.9528 126.085 78.0588L121.099 84.7596C118.376 83.9883 115.564 83.4268 112.683 83.0938L110.716 75.0256C107.959 74.7658 105.127 74.7785 102.292 74.9853L100.247 83.0932C97.3663 83.426 94.5548 83.9872 91.8316 84.7583L86.9319 78.0646C84.2852 78.8798 81.6742 79.9751 79.1337 81.251L80.3466 89.5195C77.8402 90.9209 75.4579 92.5177 73.2203 94.2894L66.1213 89.974C63.988 91.7399 61.9948 93.7511 60.1362 95.902L64.4251 103.084C62.6532 105.321 61.0561 107.703 59.6545 110.21L51.4524 108.941C50.1572 111.389 49.0853 114.009 48.1913 116.708L54.8922 121.694C54.1208 124.417 53.5594 127.229 53.2264 130.11L45.1582 132.077C44.8984 134.834 44.9111 137.666 45.1177 140.501L53.2258 142.546C53.5585 145.427 54.1197 148.238 54.8907 150.961L48.197 155.861C49.0123 158.508 50.1075 161.119 51.3836 163.659L59.6519 162.446C61.0533 164.953 62.6502 167.335 64.422 169.573L60.1065 176.672C61.8726 178.805 63.8836 180.798 66.0345 182.657L73.2163 178.368C75.4537 180.14 77.8359 181.737 80.3422 183.139L79.0731 191.341C81.5212 192.636 84.142 193.708 86.8404 194.602L91.8267 187.901C94.5499 188.672 97.3612 189.234 100.242 189.567L102.21 197.635C104.967 197.895 107.798 197.882 110.634 197.675L112.678 189.568C115.559 189.235 118.371 188.674 121.094 187.903L125.994 194.596C128.641 193.781 131.252 192.686 133.792 191.41L132.579 183.141C135.086 181.74 137.468 180.143 139.705 178.371L146.805 182.687C148.938 180.921 150.931 178.91 152.79 176.759L148.501 169.577C150.273 167.34 151.87 164.957 153.271 162.451L161.473 163.72C162.769 161.272 163.84 158.651 164.734 155.953L158.034 150.966C158.805 148.243 159.366 145.432 159.699 142.551L167.768 140.584C168.027 137.826 168.015 134.995 167.808 132.16L159.7 130.115C159.367 127.234 158.806 124.422 158.035 121.699L164.729 116.8C163.913 114.153 162.818 111.542 161.542 109.001L153.274 110.214C151.872 107.708 150.276 105.325 148.504 103.088L152.819 95.989C151.053 93.8555 149.042 91.8624 146.891 90.0038L139.71 94.2927C137.472 92.5207 135.09 90.9236 132.584 89.522ZM84.215 169.618C82.5036 172.698 78.0538 173.041 75.3156 171.5C73.433 170.474 68.9833 166.195 64.8758 159.52C61.1107 152.675 59.0569 144.973 59.0569 136.587C59.0569 122.553 65.047 110.06 74.8021 101.332C77.8827 99.6203 82.1613 99.9625 83.8727 102.872L100.816 131.966C102.185 134.362 102.185 138.983 100.645 141.379L84.215 169.618ZM143.259 166.537C137.783 173.041 130.766 178.175 122.551 181.084C111.94 184.165 98.0776 184.336 92.7722 181.427C89.1782 179.715 87.809 175.95 89.5205 172.87L106.292 143.775C107.662 141.379 111.256 139.326 113.994 139.326H146.682C150.276 139.326 152.672 142.406 152.672 145.487C152.672 148.225 150.447 157.638 143.259 166.537ZM147.367 133.335H113.138C110.229 133.164 106.806 130.768 105.437 128.201L89.1782 99.9625C87.4667 96.882 89.3493 93.4591 92.0876 91.9188C93.9702 90.8919 99.9602 89.0094 107.833 89.0094C130.253 89.5228 148.736 105.781 153.015 127.003C153.528 130.597 150.447 133.335 147.367 133.335ZM108.898 136.33C108.898 137.675 107.808 138.766 106.463 138.766C105.118 138.766 104.028 137.675 104.028 136.33C104.028 134.985 105.118 133.895 106.463 133.895C107.808 133.895 108.898 134.985 108.898 136.33Z"
        />
        <path
          className={classes.wide}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M204.934 8.30663L202.956 0.195891C200.19 -0.0647341 197.35 -0.0519713 194.506 0.155455L192.451 8.30615C189.566 8.63965 186.751 9.20158 184.024 9.97331L179.099 3.2443C176.444 4.06196 173.825 5.16064 171.277 6.44051L172.496 14.7526C169.986 16.156 167.601 17.755 165.36 19.5286L158.224 15.1905C156.084 16.9619 154.085 18.9792 152.22 21.1369L156.532 28.3564C154.758 30.5969 153.159 32.9821 151.755 35.4915L143.51 34.2157C142.21 36.6713 141.135 39.3001 140.238 42.007L146.975 47.0196C146.203 49.7464 145.64 52.5614 145.307 55.4459L137.196 57.4238C136.935 60.1897 136.948 63.0298 137.155 65.8738L145.306 67.9295C145.64 70.814 146.201 73.629 146.973 76.3558L140.244 81.2814C141.062 83.9365 142.16 86.5556 143.441 89.1036L151.752 87.8844C153.156 90.394 154.755 92.7795 156.529 95.0202L152.19 102.156C153.962 104.297 155.979 106.296 158.137 108.16L165.356 103.849C167.597 105.623 169.982 107.222 172.491 108.625L171.216 116.871C173.671 118.17 176.3 119.245 179.007 120.142L184.02 113.406C186.746 114.178 189.561 114.74 192.446 115.074L194.424 123.185C197.19 123.445 200.03 123.432 202.874 123.225L204.929 115.074C207.814 114.741 210.629 114.179 213.356 113.407L218.282 120.136C220.936 119.319 223.556 118.22 226.104 116.94L224.885 108.628C227.394 107.224 229.779 105.625 232.02 103.852L239.157 108.19C241.296 106.419 243.296 104.401 245.16 102.244L240.849 95.024C242.623 92.7835 244.222 90.3982 245.626 87.8888L253.871 89.1646C255.17 86.709 256.245 84.0802 257.142 81.3733L250.406 76.3607C251.178 73.6339 251.74 70.819 252.074 67.9345L260.184 65.9566C260.445 63.1907 260.432 60.3506 260.225 57.5066L252.074 55.451C251.741 52.5664 251.179 49.7514 250.407 47.0246L257.136 42.099C256.318 39.4439 255.22 36.8248 253.94 34.2768L245.628 35.496C244.224 32.9864 242.625 30.6011 240.852 28.3603L245.19 21.2241C243.418 19.084 241.401 17.0847 239.244 15.2204L232.024 19.5319C229.784 17.7578 227.398 16.1588 224.889 14.755L226.165 6.50957C223.709 5.21026 221.08 4.1352 218.373 3.23846L213.361 9.97462C210.634 9.20253 207.819 8.64037 204.934 8.30663ZM198.69 101.875C220.884 101.875 238.875 83.8834 238.875 61.6902C238.875 39.4969 220.884 21.5057 198.69 21.5057C176.497 21.5057 158.506 39.4969 158.506 61.6902C158.506 83.8834 176.497 101.875 198.69 101.875Z"
        />
      </svg>
    </>
  )
}

Gears.viewBoxRatio = 1.3069306931;

export function Gear(props: GearProps) {
  const { type, fill = '#f00' } = props;
  const classes = useStyles(props);
  const path: PathLookup = {
    A: 'M86.465 14.7483L87.7032 6.74626C85.3148 5.48255 82.7579 4.43694 80.1254 3.56477L75.2605 10.1021C72.6037 9.34961 69.8609 8.80184 67.0502 8.47697L65.1307 0.605563C62.4406 0.352078 59.6784 0.364492 56.9122 0.566235L54.9175 8.47641C52.1067 8.80103 49.3638 9.34855 46.707 10.1008L41.9269 3.57046C39.3447 4.36571 36.7973 5.43429 34.3189 6.67909L35.5022 14.7459C33.0568 16.1131 30.7326 17.671 28.5496 19.3995L21.6238 15.1893C19.5425 16.9122 17.5979 18.8743 15.7847 20.9728L19.969 27.9793C18.2403 30.1622 16.6821 32.4863 15.3147 34.9315L7.31264 33.6933C6.04905 36.0816 5.00332 38.6384 4.13115 41.2712L10.6686 46.1358C9.91603 48.7926 9.36826 51.5354 9.04337 54.3461L1.17194 56.2656C0.918574 58.9556 0.930872 61.718 1.1325 64.4841L9.04279 66.479C9.3674 69.2897 9.91489 72.0325 10.6671 74.6893L4.13672 79.4695C4.93209 82.0518 6.00056 84.5992 7.24559 87.0774L15.3122 85.8941C16.6794 88.3396 18.2374 90.6639 19.9659 92.8469L15.7557 99.7726C17.4787 101.854 19.4407 103.799 21.5391 105.612L28.5458 101.428C30.7286 103.156 33.0527 104.714 35.4979 106.082L34.2597 114.084C36.6481 115.348 39.205 116.393 41.8375 117.265L46.7022 110.728C49.359 111.48 52.1018 112.028 54.9124 112.353L56.832 120.225C59.522 120.478 62.2842 120.466 65.0504 120.264L67.0452 112.354C69.8559 112.029 72.5988 111.482 75.2557 110.729L80.036 117.26C82.6182 116.465 85.1656 115.396 87.644 114.151L86.4607 106.084C88.906 104.717 91.2303 103.159 93.4133 101.431L100.339 105.641C102.42 103.918 104.365 101.956 106.178 99.8575L101.994 92.8508C103.723 90.6679 105.281 88.3438 106.648 85.8986L114.65 87.1367C115.914 84.7484 116.96 82.1916 117.832 79.5589L111.294 74.6942C112.047 72.0375 112.595 69.2947 112.92 66.4841L120.791 64.5646C121.044 61.8745 121.032 59.1121 120.83 56.3461L112.92 54.3511C112.595 51.5404 112.048 48.7976 111.296 46.1409L117.826 41.3606C117.031 38.7783 115.962 36.2309 114.717 33.7527L106.651 34.936C105.283 32.4906 103.726 30.1663 101.997 27.9833L106.207 21.0576C104.484 18.9761 102.522 17.0317 100.424 15.2184L93.4173 19.4027C91.2344 17.674 88.9103 16.1158 86.465 14.7483ZM39.2762 92.8907C37.6065 95.8961 33.2653 96.2301 30.5938 94.7273C28.7571 93.7255 24.4159 89.5513 20.4087 83.0395C16.7354 76.3608 14.7317 68.8471 14.7317 60.6657C14.7317 46.9742 20.5757 34.7855 30.0929 26.27C33.0983 24.6003 37.2726 24.9343 38.9423 27.7727L55.4722 56.1575C56.8079 58.4951 56.8079 63.0032 55.3052 65.3408L39.2762 92.8907ZM96.8805 89.8852C91.5375 96.2301 84.6918 101.239 76.6773 104.078C66.3252 107.083 52.8007 107.25 47.6246 104.412C44.1183 102.742 42.7825 99.0686 44.4522 96.0631L60.8152 67.6784C62.151 65.3408 65.6573 63.3372 68.3288 63.3372H100.22C103.726 63.3372 106.064 66.3426 106.064 69.348C106.064 72.0196 103.893 81.2029 96.8805 89.8852ZM100.888 57.4932H67.494C64.6555 57.3263 61.3161 54.9887 59.9804 52.4842L44.1183 24.9343C42.4486 21.9288 44.2853 18.5895 46.9568 17.0867C48.7934 16.0849 54.6373 14.2483 62.3179 14.2483C84.1909 14.7492 102.224 30.6112 106.398 51.3154C106.899 54.8217 103.893 57.4932 100.888 57.4932ZM63.3575 60.4151C63.3575 61.7272 62.2938 62.791 60.9816 62.791C59.6694 62.791 58.6057 61.7272 58.6057 60.4151C58.6057 59.1029 59.6694 58.0392 60.9816 58.0392C62.2938 58.0392 63.3575 59.1029 63.3575 60.4151Z',
    B: 'M67.0544 8.49421L65.1307 0.605685C62.4406 0.352201 59.6784 0.364614 56.9122 0.566357L54.9131 8.49374C52.1075 8.81811 49.3697 9.36464 46.7174 10.1152L41.9269 3.57058C39.3447 4.36584 36.7973 5.43441 34.3189 6.67921L35.5047 14.7636C33.0641 16.1285 30.7441 17.6837 28.5647 19.4088L21.6238 15.1894C19.5425 16.9123 17.5979 18.8744 15.7847 20.9729L19.978 27.9946C18.2527 30.1738 16.6972 32.4936 15.332 34.9343L7.31264 33.6934C6.04905 36.0818 5.00332 38.6385 4.13115 41.2713L10.6828 46.1465C9.93194 48.7987 9.38506 51.5365 9.06046 54.342L1.17194 56.2657C0.918574 58.9558 0.930872 61.7181 1.1325 64.4842L9.06 66.4835C9.38437 69.289 9.93078 72.0269 10.6814 74.679L4.13672 79.4697C4.93209 82.052 6.00056 84.5993 7.24559 87.0776L15.3297 85.8917C16.6947 88.3326 18.2499 90.6527 19.975 92.8321L15.7557 99.7728C17.4787 101.854 19.4407 103.799 21.5391 105.612L28.561 101.419C30.7401 103.144 33.0599 104.699 35.5005 106.065L34.2597 114.084C36.6481 115.348 39.205 116.393 41.8375 117.265L46.7128 110.714C49.3648 111.465 52.1027 112.012 54.9083 112.336L56.832 120.225C59.522 120.478 62.2842 120.466 65.0504 120.264L67.0495 112.337C69.8551 112.012 72.593 111.466 75.2452 110.715L80.036 117.26C82.6182 116.465 85.1656 115.396 87.644 114.151L86.4582 106.067C88.899 104.702 91.2188 103.147 93.3982 101.422L100.339 105.641C102.42 103.918 104.365 101.956 106.178 99.8576L101.985 92.8358C103.71 90.6566 105.266 88.3366 106.631 85.896L114.65 87.1368C115.914 84.7485 116.96 82.1917 117.832 79.559L111.28 74.6837C112.031 72.0316 112.578 69.2939 112.902 66.4884L120.791 64.5647C121.044 61.8746 121.032 59.1123 120.83 56.3462L112.903 54.3469C112.579 51.5414 112.032 48.8035 111.282 46.1514L117.826 41.3607C117.031 38.7784 115.962 36.2311 114.717 33.7528L106.633 34.9387C105.268 32.4978 103.713 30.1778 101.988 27.9984L106.207 21.0577C104.484 18.9763 102.522 17.0318 100.424 15.2186L93.4021 19.4119C91.223 17.6865 88.903 16.1312 86.4623 14.7659L87.7032 6.74638C85.3148 5.48267 82.7579 4.43707 80.1254 3.56489L75.2499 10.1165C72.5976 9.36556 69.86 8.8188 67.0544 8.49421ZM60.9815 99.4987C82.5668 99.4987 100.065 82.0004 100.065 60.4151C100.065 38.8299 82.5668 21.3316 60.9815 21.3316C39.3963 21.3316 21.898 38.8299 21.898 60.4151C21.898 82.0004 39.3963 99.4987 60.9815 99.4987Z',
    C: 'M71.3883 3.7551L74.8691 18.0294L74.7319 18.0296C79.6288 19.1854 84.2275 21.1133 88.3924 23.6776L88.3614 23.6466L101.086 16.0478C104.83 19.2831 108.331 22.7526 111.405 26.4664L103.773 39.0212L103.657 38.9062C106.234 43.0689 108.174 47.6673 109.341 52.5653L109.341 52.5339L123.712 56.1581C124.072 61.0935 124.094 66.0222 123.642 70.822L109.367 74.3028L109.367 74.1562C108.212 79.0576 106.283 83.6603 103.716 87.8287L103.75 87.7951L111.349 100.519C108.113 104.264 104.644 107.764 100.93 110.839L88.3753 103.206L88.4872 103.094C84.328 105.669 79.7339 107.607 74.8405 108.775L74.8629 108.775L71.2387 123.145C66.3033 123.505 61.3746 123.527 56.5748 123.075L53.094 108.801L53.2253 108.801C48.3345 107.646 43.7411 105.722 39.5802 103.162L39.6015 103.184L26.8773 110.782C23.133 107.547 19.6322 104.077 16.5581 100.364L24.1902 87.809L24.2902 87.9087C21.7225 83.7569 19.7881 79.1722 18.6217 74.2893L18.6217 74.2966L4.2511 70.6724C3.89127 65.737 3.86914 60.8083 4.32139 56.0085L18.5957 52.5277L18.5959 52.6497C19.7506 47.7633 21.6741 43.174 24.2317 39.0164L24.2129 39.0353L16.6141 26.311C19.8494 22.5667 23.3189 19.0659 27.0327 15.9918L39.5875 23.624L39.4847 23.727C43.6399 21.1571 48.2289 19.2215 53.1165 18.0554L53.1002 18.0554L56.7244 3.68482C61.6598 3.32498 66.5885 3.30285 71.3883 3.7551ZM63.9786 86.7309C76.8556 86.7309 87.2943 76.292 87.2943 63.4152C87.2943 50.5383 76.8556 40.0994 63.9786 40.0994C51.1015 40.0994 40.6628 50.5383 40.6628 63.4152C40.6628 76.292 51.1015 86.7309 63.9786 86.7309Z'
  };
  return (
    <svg
      width={120}
      viewBox="0 0 120 120"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={classes.spinnerGear}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={path[type]}
      />
    </svg>

  );
}

Gear.defaultProps = {
  type: 'A',
  speed: '6s'
};
