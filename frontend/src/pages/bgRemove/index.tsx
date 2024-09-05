import { Button, Carousel, Form, FormProps, Input, Space, Spin, Upload, message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import transparent_image from '../../../public/transparent_image.png'
import { removeBackground } from "@imgly/background-removal"
import { UploadOutlined } from "@ant-design/icons";
import bg_remove_example from '../../../public/bg-remove-example.webp'
import bg_remove_example_end from '../../../public/bg-remove-example-end.png'

export function BgRemove() {
    const [imgOne, setImgOne] = useState('')
    const [imgTwo, setImgTwo] = useState('')
    const [loading, setLoading] = useState(false)
    return <div style={{ paddingTop: 50 }}>
        <div style={{ textAlign: 'center' }}>
            <Space>
                <Upload showUploadList={false} beforeUpload={(file) => {
                    if (loading) {
                        message.error('请等待图片处理完成')
                        return;
                    }
                    let u = URL.createObjectURL(file)
                    setImgOne(u)
                    setImgTwo('')
                    return false
                }}>
                    <Button icon={<UploadOutlined />}>上传图片</Button>
                </Upload>
                <Button onClick={async () => {
                    if (loading) {
                        message.error('请等待图片处理完成')
                        return;
                    }
                    if (imgOne === '') {
                        message.error('请先上传图片')
                        return
                    }
                    setLoading(true)
                    let blob = await removeBackground(imgOne);
                    const url = URL.createObjectURL(blob);
                    setImgTwo(url)
                    setLoading(false)
                }}>去背景</Button>
                <Button onClick={() => {
                    if (loading) {
                        message.error('请等待图片处理完成')
                        return;
                    }
                    if (imgTwo === '') {
                        message.error('请先点击去背景')
                        return
                    }
                    const downloadLink = document.createElement('a');
                    downloadLink.href = imgTwo;
                    downloadLink.download = new Date().getTime() + '.png';
                    // 触发点击事件，下载文件
                    downloadLink.click();

                    // 释放 URL 对象
                    //    URL.revokeObjectURL(downloadLink.href);
                }}>下载</Button>

            </Space>

        </div>

        <div style={{ height: 30 }}></div>
        <div style={{ width: 600, height: 600, margin: '0px auto' }}>
            {
                imgOne ? <Spin spinning={loading}>
                    <ReactCompareSlider
                        itemOne={<ReactCompareSliderImage src={imgOne} alt="Image one" width={600} />}
                        itemTwo={<ReactCompareSliderImage src={imgTwo} alt="Image two" width={600} style={{
                            backgroundColor: "white",
                            backgroundImage: `
                          linear-gradient(45deg, rgb(204, 204, 204) 25%, transparent 25%),
                          linear-gradient(-45deg, rgb(204, 204, 204) 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, rgb(204, 204, 204) 75%),
                          linear-gradient(-45deg, transparent 75%, rgb(204, 204, 204) 75%)
                        `,
                            backgroundSize: "20px 20px",
                            backgroundPosition: "0px 0px, 0px 10px, 10px -10px, -10px 0px"
                        }} />}
                    />
                </Spin> : <div style={{ textAlign: 'center' }}>
                    请先上传图片
                    <div>    <Button type="link" onClick={() => {
                        setImgOne(bg_remove_example)
                    }}>使用示例图片</Button></div>
                    <ReactCompareSlider
                        itemOne={<ReactCompareSliderImage src={bg_remove_example} alt="Image one" width={600} />}
                        itemTwo={<ReactCompareSliderImage src={bg_remove_example_end} alt="Image two" width={600} style={{

                            backgroundColor: "white",
                            backgroundImage: `
                          linear-gradient(45deg, rgb(204, 204, 204) 25%, transparent 25%),
                          linear-gradient(-45deg, rgb(204, 204, 204) 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, rgb(204, 204, 204) 75%),
                          linear-gradient(-45deg, transparent 75%, rgb(204, 204, 204) 75%)
                        `,
                            backgroundSize: "20px 20px",
                            backgroundPosition: "0px 0px, 0px 10px, 10px -10px, -10px 0px"
                        }} />}
                    />
                </div>
            }


        </div>

    </div >
}