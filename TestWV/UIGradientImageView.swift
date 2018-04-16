//
//  UIGradientImageView.swift
//  TestWV
//
//  Created by earth on 05/10/17.
//  Copyright © 2017 earth. All rights reserved.
//

import UIKit

class UIGradientImageView: UIImageView {

    /*
    // Only override draw() if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func draw(_ rect: CGRect) {
        // Drawing code
    }
    */
    let myGradientLayer: CAGradientLayer
    
    override init(frame: CGRect){
        myGradientLayer = CAGradientLayer()
        super.init(frame: frame)
        self.setup()
        addGradientLayer()
    }
    
    func addGradientLayer(){
        if myGradientLayer.superlayer == nil{
            self.layer.addSublayer(myGradientLayer)
        }
    }
    
    required init(coder aDecoder: NSCoder){
        myGradientLayer = CAGradientLayer()
        super.init(coder: aDecoder)!
        self.setup()
        addGradientLayer()
    }
    
    func getColors() -> [CGColor] {
        return [UIColor.clear.cgColor, UIColor(red: 255, green: 255, blue: 255, alpha: 0.9).cgColor]
        //alpha 0.5
    }
    
    func getLocations() -> [CGFloat]{
        //0.5,0.9
        return [0.1,  0.9]
    }
    
    func setup() {
        myGradientLayer.startPoint = CGPoint(x: 0.5, y: 0)
        myGradientLayer.endPoint = CGPoint(x: 0.5, y: 1)
        
        let colors = getColors()
        myGradientLayer.colors = colors
        myGradientLayer.isOpaque = false
        myGradientLayer.locations = getLocations() as [NSNumber]
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        myGradientLayer.frame = self.layer.bounds
    }

}
